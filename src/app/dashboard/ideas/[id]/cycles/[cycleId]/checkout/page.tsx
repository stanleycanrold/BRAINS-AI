export const dynamic = "force-dynamic";

import { Header } from "@/components/ui/header";
import { Card, Badge, Button } from "@/components/ui/index";
import { Lock, Shield, Copy, Eye, EyeOff, ChevronRight } from "lucide-react";
import { useState } from "react";

interface FastTrackCheckoutPageProps {
  params: Promise<{ id: string }>;
}

export default async function FastTrackCheckoutPage({
  params,
}: FastTrackCheckoutPageProps) {
  const { id } = await params;

  return (
    <>
      <Header
        title="Fast Track Checkout"
        subtitle="Complete your expert validation order"
      />

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left: Form (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white text-sm font-bold">
              ✓
            </div>
            <span className="text-sm font-medium text-text-primary">Experts Selected</span>

            <div className="flex-1 h-1 bg-bg-border mx-2" />

            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
              02
            </div>
            <span className="text-sm font-medium text-text-primary">Secure Payment</span>

            <div className="flex-1 h-1 bg-bg-border mx-2" />

            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-elevated text-text-muted text-sm font-bold">
              03
            </div>
            <span className="text-sm font-medium text-text-muted">Sources Start</span>
          </div>

          {/* Payment Form */}
          <Card elevated>
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Credit Card Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="label">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Card Number</label>
                <input
                  type="text"
                  placeholder="6666  6666  6666  6666"
                  className="input-field font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">CVC</label>
                  <input
                    type="text"
                    placeholder="***"
                    className="input-field font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="save-card"
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="save-card" className="text-sm text-text-secondary">
                  Save card information for future validation rounds and report updates.
                </label>
              </div>
            </div>
          </Card>

          {/* Security Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-text-primary">
                  Expert Guarantee
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Full refund if target expert quality is not met within 72h.
              </p>
            </Card>

            <Card className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-text-primary">
                  Bank-Level Security
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                AES-256 encrypted transaction handled via Stripe.
              </p>
            </Card>
          </div>

          {/* Testimonial */}
          <div className="bg-gray-900 text-white rounded-lg p-6">
            <p className="text-sm italic mb-3">
              "*The expert insights we got through BRAINS AI saved us from burning $2M
              on a feature that users simply didn't need. The validation speed is unmatched.*"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600" />
              <div>
                <p className="text-sm font-medium">SARAH CHEN, PRODUCT LEAD @ HEXDEN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary (1 column) */}
        <div className="space-y-6">
          <Card elevated className="sticky top-8 space-y-6">
            <h3 className="font-semibold text-text-primary text-lg">Investment Summary</h3>

            <div className="space-y-4 pb-4 border-b border-bg-border">
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">Fast-Track Validation</p>
                <p className="text-lg font-bold text-text-primary">$1,740.00</p>
                <p className="text-xs text-text-muted">12 experts × $150</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-text-secondary">AI Synthesis & Analysis Fee</p>
                <p className="text-lg font-bold text-text-primary">$250.00</p>
                <p className="text-xs text-text-muted">
                  Full Qualitative Report
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-text-secondary">Priority Sourcing</p>
                <p className="text-lg font-bold text-success">FREE</p>
                <p className="text-xs text-text-muted">Maylist Skip</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-primary">Total Amount</span>
                <span className="text-2xl font-bold text-text-primary">$1,990.00</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Turnaround</span>
                <span className="text-text-muted font-medium">12 Days</span>
              </div>
            </div>

            <Button className="w-full gap-2">
              PAY & START SOURCING
              <ChevronRight className="h-4 w-4" />
            </Button>

            <p className="text-xs text-text-muted text-center">
              By clicking, you agree to our service terms
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
