import { PropsWithChildren, useState } from "react";

export default function VideoFrame({ children }: PropsWithChildren<{}>) {
  const [maxHeight, setMaxHeight] = useState();
  const [maxInnerWidth, setMaxInnerWidth] = useState();
  const [maxInnerWidth, setMaxInnerWidth] = useState();

  return (
    <div className="mx-auto w-full flex-grow flex justify-center" style={{ maxWidth, maxHeight }}>
      <div className="w-full h-full flex items-center" style={`{maxWidth: maxInnerWidth}`}>
        <div className="w-full h-0 relative" style="{paddingTop: `${aspectRatio}%`}">
          <div className="absolute inset-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
