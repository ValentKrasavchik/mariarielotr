import Image from "next/image";

type MaxIconProps = {
  className?: string;
  size?: number;
};

export function MaxIcon({ className, size = 20 }: MaxIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block shrink-0 align-middle ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/max-logo.png"
        alt=""
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </span>
  );
}
