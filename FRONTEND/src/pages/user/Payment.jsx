import { useMemo, useState } from "react";
import PaymentHero from "../../components/user/payment/PaymentHero";
import PaymentReceiverInfo from "../../components/user/payment/PaymentReceiverInfo";
import PaymentPackageList from "../../components/user/payment/PaymentPackageList";
import PaymentSummary from "../../components/user/payment/PaymentSummary";
import { PAYMENT_PACKAGES } from "../../constants/payment";

export default function Payment() {
  const [selectedPackageId, setSelectedPackageId] = useState(PAYMENT_PACKAGES[0]?.id ?? 1);

  const selectedPackage = useMemo(
    () => PAYMENT_PACKAGES.find((pkg) => pkg.id === selectedPackageId) || PAYMENT_PACKAGES[0],
    [selectedPackageId]
  );

  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-10 md:px-12 md:py-12">
      <PaymentHero />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-8">
          <PaymentPackageList
            selectedPackageId={selectedPackageId}
            onSelectPackage={setSelectedPackageId}
          />
          <PaymentReceiverInfo />
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <PaymentSummary selectedPackage={selectedPackage} />
          </div>
        </div>
      </div>
    </section>
  );
}