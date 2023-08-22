import { BookProps } from "../classBlocks/dataTypes";

export default function Book({ bookData }: BookProps) {
  return (
    <div className="grid md:grid-cols-2 gap-2 my-2 md:w-5/6">
      <div>{bookData.attributes.name}</div>
      <div>{bookData.authorName}</div>
    </div>
  );
}
