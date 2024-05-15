import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { MemberRole } from "@prisma/client";

export const POST = async (req: Request) => {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await prisma.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        invitedCode: uuidv4(),
        channels: {
          create: [{ name: "genera", profileId: profile.id }],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
