"use client";

import React, { use, useActionState, useEffect, useRef, useState } from "react";
import Image from "./Image";
import { addPost } from "@/actions";
import NextImage from "next/image";
import ImageEditor from "./ImageEditor";
import { useUser } from "@clerk/nextjs";

const Share = () => {
  const [media, setMedia] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<{
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }>({
    type: "original",
    sensitive: false,
  });

  const handleMediaChanage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const prevUrl = media ? URL.createObjectURL(media) : null;

  const { user } = useUser();

  const [state, formAction, isPending] = useActionState(addPost, {
    success: false,
    error: false,
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.success) {
      if (formRef.current) formRef.current.reset();
      setMedia(null);
      setIsEditorOpen(false);
      setSettings({ type: "original", sensitive: false });
    }
  }, [state]);

  return (
    <form className="p-4 flex gap-4" action={formAction} ref={formRef}>
      {/* avatar */}
      <div className="relative rounded-full w-10 h-10 overflow-hidden">
        <Image
          src={user?.imageUrl}
          alt="avatar"
          width={100}
          height={100}
          tr={true}
        />
      </div>
      {/* input section */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          type="string"
          name="imgType"
          value={settings.type}
          hidden
          readOnly
        />
        <input
          type="text"
          name="isSensitive"
          value={settings.sensitive ? "true" : "false"}
          hidden
          readOnly
        />
        <input
          name="desc"
          type="text"
          placeholder="what is hapenning?"
          className="bg-transparent outline-none placeholder:text-textGray text-xl"
        />
        {media?.type.includes("image") && prevUrl && (
          <div className="relative rounded-xl overflow-hidden">
            <NextImage
              src={prevUrl}
              alt="preview image"
              width={600}
              height={600}
              className={`w-full ${
                settings.type === "original"
                  ? "h-full object-contain"
                  : settings.type === "square"
                  ? "aspect-square object-cover"
                  : "aspect-video object-cover"
              }`}
            />
            <div
              onClick={() => setIsEditorOpen(true)}
              className="absolute top-2 left-2 bg-black bg-opacity-50 py-1 px-4 rounded-full font-bold text-sm cursor-pointer text-white"
            >
              edit
            </div>
            <div
              onClick={() => setMedia(null)}
              className="absolute top-2 right-2 cursor-pointer font-bold text-sm bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center"
            >
              X
            </div>
          </div>
        )}
        {media?.type.includes("video") && prevUrl && (
          <div className="relative">
            <video src={prevUrl} controls></video>
            <div
              onClick={() => setMedia(null)}
              className="absolute top-2 right-2 cursor-pointer font-bold text-sm bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center"
            >
              X
            </div>
          </div>
        )}
        {isEditorOpen && prevUrl && (
          <ImageEditor
            onClose={() => setIsEditorOpen(false)}
            prevUrl={prevUrl}
            settings={settings}
            setSettings={setSettings}
          />
        )}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-4 flex-wrap">
            <input
              name="file"
              type="file"
              onChange={handleMediaChanage}
              className="hidden"
              id="file"
              accept="image/*,video/*"
            />
            <label htmlFor="file">
              <Image
                path="icons/image.svg"
                alt=""
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </label>
            <Image
              path="icons/gif.svg"
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <Image
              path="icons/poll.svg"
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <Image
              path="icons/emoji.svg"
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <Image
              path="icons/schedule.svg"
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <Image
              path="icons/location.svg"
              alt=""
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </div>
          <button
            className="bg-white text-black font-bold rounded-full py-2 px-4 disabled:cursor-not-allowed disabled:bg-gray-200"
            disabled={isPending}
          >
            {isPending ? "Posting" : "Post"}
          </button>
        </div>
        {state.error && <p className="text-red-400">something went wrong.</p>}
      </div>
    </form>
  );
};

export default Share;
