CREATE TYPE rate_period AS ENUM (
  'weekly',
  'biweekly',
  'monthly',
  'quarterly',
  'biannual',
  'annual'
);

CREATE TABLE rental_plans (
    id BIGSERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    name TEXT NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    rate_period rate_period NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE rentals (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES rental_plans(id),
    owner_id INTEGER REFERENCES users(id),
    tenant_id INTEGER REFERENCES users(id),
    start_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);


CREATE TABLE rental_payments (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER REFERENCES rentals(id),
    payer_id INTEGER REFERENCES users(id),
    amount NUMERIC NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL,
    proof_of_payment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);