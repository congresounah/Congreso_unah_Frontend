import Image from "next/image";
import Button from "./Button";
import { useRouter } from 'next/navigation';

export default function SuccessScreen({title, comment, buttonTitle, redirectionRoute, router }: { title: string, comment: string, buttonTitle: string, redirectionRoute: string, router: ReturnType<typeof useRouter> }) {
  return (
    <>
      <h1 className="text-4xl font-semibold text-center mt-4">{title}</h1>
      <div className="flex flex-col gap-4 py-8 px-2 w-[80%] md:w-[70%] lg:w-3/5 justify-center items-center text-center">
        <p className="text-[#ab9a9a]">{comment}</p>
        <Image src="/img/check.svg" alt="Cuenta confirmada" className="w-1/5 mb-4" width={100} height={100} />
        <Button text={buttonTitle} action={() => router.push(redirectionRoute)} variant="primary" styleType="fill" />
      </div>
    </>
  );
}