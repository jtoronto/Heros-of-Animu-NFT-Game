import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import "./ImageWithLoadingIndicator.css";

const ImageWithLoadingIndicator = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  const Loader = (props) => (
    <ContentLoader
      speed={2}
      width={200}
      height={350}
      viewBox="0 0 200 350"
      backgroundColor="#626060"
      foregroundColor="#ecebeb"
      {...props}
    >
      <circle cx="63" cy="51" r="48" />
      <rect x="-2" y="110" rx="0" ry="0" width="131" height="127" />
    </ContentLoader>
  );

  const handleOnLoadEvent = () => {
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && <Loader className="Loader" />}
      <img src={src} alt={alt} onLoad={handleOnLoadEvent} />
    </div>
  );
};
export default ImageWithLoadingIndicator;
