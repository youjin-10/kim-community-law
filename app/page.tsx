import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="space-y-12 md:space-y-16 lg:space-y-20 text-center p-1 md:p-3">
          <section className="space-y-4 md:space-y-5 lg:space-y-10">
            <div>
              <h1 className="text-[#111] mb-2 text-sm md:text-lg">
                변호사를 위한 모든 것, 김변호사
              </h1>
              <div className="flex justify-center">
                <Image
                  src="/images/brandmark.svg"
                  alt="Company Logo"
                  width={277}
                  height={32}
                  sizes="(min-width: 1024px) 277px, (min-width: 768px) 210px, 170px"
                  priority
                  className="w-[170px] md:w-[210px] lg:w-[277px] h-auto"
                />
              </div>
            </div>
            <div className="bg-[#F8F8FA] rounded-xl px-4 sm:px-9 py-2">
              <div className="flex text-xs md:text-sm ld:text-base justify-between">
                <div className="font-[#112D4E] font-semibold">9/00 현재</div>
                <div>전체 회원수: 1234명</div>
                <div>전국 변호사 가입률 60%</div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <Link href="/login">
              <Button className="w-52 md:w-64 bg-[#112F4E]" size="lg">
                로그인
              </Button>
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground">
              아직 계정이 없으신가요?{" "}
              <Link
                className="font-medium hover:underline text-[#111]"
                href="/signup"
              >
                회원가입
              </Link>
            </p>
          </section>

          <section>
            <div className="flex justify-center items-center space-x-2 text-xs md:text-sm text-[#111]">
              <Link className="hover:underline" href="#">
                채용안내
              </Link>
              <span className="text-border">|</span>
              <Link className="hover:underline" href="#">
                파트너십
              </Link>
              <span className="text-border">|</span>
              <Link className="hover:underline" href="#">
                강사신청
              </Link>
              <span className="text-border">|</span>
              <Link className="hover:underline" href="#">
                문의하기
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
