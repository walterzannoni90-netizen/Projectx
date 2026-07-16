-- ============================================================
-- PROJECT X - Database Schema
-- PostgreSQL
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'banned', 'deleted');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'quantization_earning', 'referral_reward', 'fee', 'bonus');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE quantization_status AS ENUM ('idle', 'running', 'completed', 'failed');
CREATE TYPE notification_type AS ENUM ('deposit', 'withdrawal', 'referral', 'level_up', 'quantization', 'admin_message', 'system_update');
CREATE TYPE wallet_chain AS ENUM ('TRC20', 'BEP20', 'ERC20', 'POLYGON', 'ARBITRUM', 'SOLANA');
CREATE TYPE admin_role AS ENUM ('superadmin', 'admin', 'moderator', 'support');

-- ============================================================
-- TABLES
-- ============================================================

-- 1. USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    nickname VARCHAR(100),
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id),
    status user_status NOT NULL DEFAULT 'pending',
    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret TEXT,
    pin_hash TEXT,
    pin_set_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    account_age_days INTEGER GENERATED ALWAYS AS (EXTRACT(DAY FROM NOW() - created_at)) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_users_status ON users(status);

-- 2. PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    language VARCHAR(10) NOT NULL DEFAULT 'it',
    theme VARCHAR(20) NOT NULL DEFAULT 'light',
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_profiles_user_id ON profiles(user_id);

-- 3. WALLETS (one per user, holds balances)
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_balance DECIMAL(20,8) NOT NULL DEFAULT 0,
    operating_capital DECIMAL(20,8) NOT NULL DEFAULT 0,
    available_balance DECIMAL(20,8) NOT NULL DEFAULT 0,
    total_deposited DECIMAL(20,8) NOT NULL DEFAULT 0,
    total_withdrawn DECIMAL(20,8) NOT NULL DEFAULT 0,
    total_earned DECIMAL(20,8) NOT NULL DEFAULT 0,
    total_fees DECIMAL(20,8) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_wallets_user_id ON wallets(user_id);

-- 4. WALLET ADDRESSES (multi-chain deposit addresses per user)
CREATE TABLE wallet_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chain wallet_chain NOT NULL,
    address TEXT NOT NULL,
    label VARCHAR(100),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallet_addresses_user_id ON wallet_addresses(user_id);
CREATE INDEX idx_wallet_addresses_chain ON wallet_addresses(chain);

-- 5. DEPOSITS
CREATE TABLE deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    chain wallet_chain NOT NULL,
    tx_hash TEXT UNIQUE,
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    amount_usd DECIMAL(20,8),
    fee DECIMAL(20,8) NOT NULL DEFAULT 0,
    confirmations INTEGER NOT NULL DEFAULT 0,
    required_confirmations INTEGER NOT NULL DEFAULT 12,
    status transaction_status NOT NULL DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deposits_user_id ON deposits(user_id);
CREATE INDEX idx_deposits_status ON deposits(status);
CREATE INDEX idx_deposits_tx_hash ON deposits(tx_hash);

-- 6. WITHDRAWALS
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    chain wallet_chain NOT NULL,
    to_address TEXT NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    amount_usd DECIMAL(20,8),
    fee DECIMAL(20,8) NOT NULL DEFAULT 0,
    fee_percent DECIMAL(5,2) NOT NULL DEFAULT 15.00,
    pin_verified BOOLEAN NOT NULL DEFAULT FALSE,
    pin_verified_at TIMESTAMPTZ,
    admin_approved_by UUID REFERENCES admin_users(id),
    admin_approved_at TIMESTAMPTZ,
    tx_hash TEXT,
    status transaction_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    completed_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

-- 7. TRANSACTIONS (complete audit log)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id),
    type transaction_type NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    fee DECIMAL(20,8) NOT NULL DEFAULT 0,
    balance_before DECIMAL(20,8) NOT NULL,
    balance_after DECIMAL(20,8) NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_reference ON transactions(reference_type, reference_id);

-- 8. QUANTIZATIONS
CREATE TABLE quantizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    level_id UUID NOT NULL REFERENCES levels(id),
    amount_invested DECIMAL(20,8) NOT NULL,
    expected_return DECIMAL(20,8) NOT NULL,
    actual_return DECIMAL(20,8),
    daily_yield DECIMAL(20,8) NOT NULL DEFAULT 0,
    status quantization_status NOT NULL DEFAULT 'idle',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quantizations_user_id ON quantizations(user_id);
CREATE INDEX idx_quantizations_status ON quantizations(status);

-- 9. QUANTIZATION HISTORY
CREATE TABLE quantization_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quantization_id UUID NOT NULL REFERENCES quantizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cycle_number INTEGER NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    return_amount DECIMAL(20,8) NOT NULL,
    yield_percent DECIMAL(10,6) NOT NULL,
    status quantization_status NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quantization_history_quantization_id ON quantization_history(quantization_id);
CREATE INDEX idx_quantization_history_user_id ON quantization_history(user_id);

-- 10. LEVELS (definitions)
CREATE TABLE levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_number INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    min_operating_capital DECIMAL(20,8) NOT NULL DEFAULT 0,
    min_referrals INTEGER NOT NULL DEFAULT 0,
    min_account_days INTEGER NOT NULL DEFAULT 0,
    daily_yield_percent DECIMAL(10,6) NOT NULL,
    quantizations_per_day INTEGER NOT NULL DEFAULT 1,
    fee_reduction_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    referral_bonus_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    referral_level1_percent DECIMAL(5,2) NOT NULL DEFAULT 8.00,
    referral_level2_percent DECIMAL(5,2) NOT NULL DEFAULT 5.00,
    referral_level3_percent DECIMAL(5,2) NOT NULL DEFAULT 3.00,
    withdrawal_fee_percent DECIMAL(5,2) NOT NULL DEFAULT 15.00,
    benefits JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_levels_level_number ON levels(level_number);

-- 11. USER LEVELS (user's current level and progress)
CREATE TABLE user_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_level_id UUID NOT NULL REFERENCES levels(id),
    next_level_id UUID REFERENCES levels(id),
    current_capital DECIMAL(20,8) NOT NULL DEFAULT 0,
    target_capital DECIMAL(20,8) NOT NULL DEFAULT 0,
    current_referrals INTEGER NOT NULL DEFAULT 0,
    target_referrals INTEGER NOT NULL DEFAULT 0,
    progress_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    upgraded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_user_levels_user_id ON user_levels(user_id);

-- 12. REFERRALS
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1,
    commission_earned DECIMAL(20,8) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE UNIQUE INDEX idx_referrals_referred ON referrals(referred_id);

-- 13. REFERRAL REWARDS
CREATE TABLE referral_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    from_user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(20,8) NOT NULL,
    level INTEGER NOT NULL,
    percent DECIMAL(5,2) NOT NULL,
    source_transaction_id UUID REFERENCES transactions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referral_rewards_user_id ON referral_rewards(user_id);
CREATE INDEX idx_referral_rewards_referral_id ON referral_rewards(referral_id);

-- 14. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    data JSONB,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- 15. SESSIONS
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    user_agent TEXT,
    ip_address INET,
    device_name VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX idx_sessions_active ON sessions(user_id) WHERE is_active = TRUE;

-- 16. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    admin_id UUID REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- 17. SETTINGS (system-wide settings)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_settings_key ON settings(key);

-- 18. ADMIN USERS
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role admin_role NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. ADMIN LOGS
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- 20. SECURITY EVENTS
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'info',
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);
CREATE INDEX idx_security_events_created_at ON security_events(created_at DESC);

-- 21. SUPPORT TICKETS
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    assigned_to UUID REFERENCES admin_users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_wallet_addresses_updated_at BEFORE UPDATE ON wallet_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_deposits_updated_at BEFORE UPDATE ON deposits FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_withdrawals_updated_at BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_quantizations_updated_at BEFORE UPDATE ON quantizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_levels_updated_at BEFORE UPDATE ON levels FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_user_levels_updated_at BEFORE UPDATE ON user_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED DATA: Default levels
-- ============================================================
INSERT INTO levels (level_number, name, min_operating_capital, min_referrals, min_account_days,
    daily_yield_percent, quantizations_per_day, fee_reduction_percent, referral_bonus_percent,
    referral_level1_percent, referral_level2_percent, referral_level3_percent, withdrawal_fee_percent,
    benefits)
VALUES
    (1, 'Bronze', 0, 0, 0,
     0.05, 1, 0, 0,
     8.00, 5.00, 3.00, 15.00,
     '{"features": ["Accesso base", "1 quantizzazione/giorno"], "color": "#CD7F32"}'),
    (2, 'Silver', 500, 2, 7,
     0.08, 2, 5, 2,
     8.00, 5.00, 3.00, 14.25,
     '{"features": ["2 quantizzazioni/giorno", "Fee ridotte del 5%", "Bonus referral 2%"], "color": "#C0C0C0"}'),
    (3, 'Gold', 2000, 5, 14,
     0.12, 3, 10, 4,
     8.50, 5.50, 3.50, 13.50,
     '{"features": ["3 quantizzazioni/giorno", "Fee ridotte del 10%", "Bonus referral 4%"], "color": "#FFD700"}'),
    (4, 'Platinum', 8000, 10, 30,
     0.18, 4, 15, 6,
     9.00, 6.00, 4.00, 12.75,
     '{"features": ["4 quantizzazioni/giorno", "Fee ridotte del 15%", "Bonus referral 6%", "Supporto prioritario"], "color": "#E5E4E2"}'),
    (5, 'Diamond', 25000, 20, 60,
     0.25, 5, 20, 8,
     9.50, 6.50, 4.50, 12.00,
     '{"features": ["5 quantizzazioni/giorno", "Fee ridotte del 20%", "Bonus referral 8%", "Supporto VIP"], "color": "#B9F2FF"}'),
    (6, 'Elite', 100000, 50, 90,
     0.35, 8, 25, 10,
     10.00, 7.00, 5.00, 11.25,
     '{"features": ["8 quantizzazioni/giorno", "Fee ridotte del 25%", "Bonus referral 10%", "Supporto Concierge"], "color": "#6A0DAD"}');

-- Nessun amministratore viene creato automaticamente.
-- Il primo superadmin deve essere provisionato tramite un flusso sicuro fuori dal repository.

-- ============================================================
-- SEED DATA: Default settings
-- ============================================================
INSERT INTO settings (key, value, description, category, is_public)
VALUES
    ('min_deposit', '{"amount": 100, "currency": "USDT"}', 'Deposito minimo', 'wallet', true),
    ('min_withdrawal', '{"amount": 30, "currency": "USDT"}', 'Prelievo minimo', 'wallet', true),
    ('withdrawal_cooldown_hours', '{"hours": 48}', 'Intervallo minimo tra prelievi', 'wallet', true),
    ('withdrawal_processing_hours', '{"min": 24, "max": 72}', 'Tempo elaborazione prelievi', 'wallet', true),
    ('default_withdrawal_fee', '{"percent": 15.00}', 'Fee prelievo predefinita', 'wallet', true),
    ('maintenance_mode', '{"enabled": false}', 'Modalità manutenzione', 'system', true),
    ('signup_enabled', '{"enabled": true}', 'Registrazione aperta', 'system', true),
    ('quantization_cooldown_seconds', '{"seconds": 3600}', 'Cooldown tra quantizzazioni', 'quantization', true),
    ('platform_name', '{"name": "NUMMY"}', 'Nome piattaforma', 'general', true),
    ('support_email', '{"email": "support@nummy.com"}', 'Email supporto', 'general', true);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quantizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quantization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
