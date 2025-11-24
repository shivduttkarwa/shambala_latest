import { FC, ReactNode } from "react";
import styles from "./FullWidthImage.module.css";

const publicUrl = import.meta.env.BASE_URL;

type FullWidthImageProps = {
  imageUrl?: string;
  children?: ReactNode;
};

const FullWidthImage: FC<FullWidthImageProps> = ({
  imageUrl = `${publicUrl}images/bg.png`,
  children,
}) => {
  // No CTA/popup state needed

  return (
    <section className={styles["fwi-wrapper"]}>
      <div
        className={styles["fwi-hero-image"]}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {children}
      </div>
    </section>
  );
};

export default FullWidthImage;
