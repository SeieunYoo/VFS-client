import { Metadata } from "next";
import { ItemBox } from "./_components/ItemBox";
import { Navigation } from "./_components/Navigation";

export const metadata: Metadata = {
  title: "TryOnMe | 내 맘대로 옷 입어봐",
  description: "가상 옷 피팅 서비스",
};

const MainPage = () => {
  return (
    <>
      <Navigation />
      <div className="pt-[35px]">
        <div className="@[480px]:p-4">
          <div
            className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("/main-page-example.png")`,
            }}
          >
            <div className="flex flex-col gap-2 text-left">
              <h1 className="text-white text-4xl leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] font-bold font-[Musinsa-Bold]">
                Try it on, virtually!
              </h1>
              <h2 className="text-white text-lg font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                Preview how your clothes will look on you
              </h2>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-black text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
              <span className="truncate">Start Shopping</span>
            </button>
          </div>
        </div>
      </div>
      <h3 className="text-black text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Trending
      </h3>
      <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch p-4 gap-3">
          <ItemBox />
          <ItemBox />
          <ItemBox />
          <ItemBox />
        </div>
      </div>
      <h3 className="text-black text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        New Arrivals
      </h3>
      <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch p-4 gap-3">
          <ItemBox />
          <ItemBox />
          <ItemBox />
        </div>
      </div>
    </>
  );
};

export default MainPage;
