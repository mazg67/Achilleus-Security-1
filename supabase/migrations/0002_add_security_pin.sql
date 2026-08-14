-- Adds a per-guest security PIN, used on the Hospitality Security List report
-- so venue security can verify a guest's identity against their booking.
alter table guests add column if not exists security_pin text;
