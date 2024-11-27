import { useRouter } from "next/router";

import { LeftArrow } from "@/components/Icons/LeftArrow";

export const Navigation = () => {
  const router = useRouter();
  return (
    <div className="fixed bg-white pb-[20px] w-[100vw] pt-[20px] lg:w-[390px]">
      <button
        onClick={() => {
          router.back();
        }}
      >
        <LeftArrow />
      </button>
    </div>
  );
};
