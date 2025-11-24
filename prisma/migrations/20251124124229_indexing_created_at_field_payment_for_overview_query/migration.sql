-- CreateIndex
CREATE INDEX "PaymentDetails_stripe_payment_id_idx" ON "PaymentDetails"("stripe_payment_id");

-- CreateIndex
CREATE INDEX "PaymentDetails_created_at_idx" ON "PaymentDetails"("created_at");
