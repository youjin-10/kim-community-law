// app/api/company-search/route.ts

import { NextRequest, NextResponse } from "next/server";

function createResponse(data: any, message: string, status: number) {
  return NextResponse.json({ data, message }, { status });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  // if (!query) {
  //   return NextResponse.json(
  //     { message: "Query parameter is missing" },
  //     { status: 400 }
  //   );
  // }

  if (!query) {
    return createResponse(null, "Query parameter is missing", 400);
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch places from Kakao API");
    }

    const data = await response.json();
    // return NextResponse.json(data);
    return createResponse(data, "Success", 200);
  } catch (error) {
    // return NextResponse.json(
    //   { message: (error as Error).message },
    //   { status: 500 }
    // );
    return createResponse(null, (error as Error).message, 500);
  }
}
