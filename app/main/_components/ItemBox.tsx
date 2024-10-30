import Image from "next/image";
import ItemImage from "../../../public/cloth-example.jpg";
import Link from "next/link";

export const ItemBox = () => {
  return (
    <Link
      className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60"
      href="/details/1"
    >
      <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col">
        <Image src={ItemImage} alt="cloth-image" width={240} height={135} />
      </div>
      <div>
        <p className="text-black text-base font-medium leading-normal">APC</p>
        <p className="text-[#57748e] text-sm font-normal leading-normal">
          silk long dress
        </p>
      </div>
    </Link>
  );
};
