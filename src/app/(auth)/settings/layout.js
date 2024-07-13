import Navbar from "@/components/shared/Navbar";
import AdjusterNavigationProvider from "@/context/adjusterNavigation-provider";
import ClaimDataProvider from "@/context/claimData-provider";
import ClaimFormProvider from "@/context/claimform-provider";
import MultiStepProvider from "@/context/multistep-provider";

export default function RootLayout({ children }) {
  return (
    <AdjusterNavigationProvider>
      <MultiStepProvider>
        <ClaimDataProvider>
          <ClaimFormProvider>
            <div>
              <Navbar />
              <div className="pt-[4rem]">{children}</div>
            </div>
          </ClaimFormProvider>
        </ClaimDataProvider>
      </MultiStepProvider>
    </AdjusterNavigationProvider>
  );
}
