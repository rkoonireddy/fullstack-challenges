import useStoresData from "../hooks/useStoresData.tsx";
import Book from "./books.tsx";
import Rating from "./ratings.tsx";
// import { Fragment } from "react";

import {
  StoreProps,
  Book as BookType,
  Author as AuthorType,
} from "../classBlocks/dataTypes.ts";

export default function BookStore({ store }: StoreProps) {
  const { storesData } = useStoresData();

  const formatDate = (date: string): string => {
    const formattedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return formattedDate.toLocaleDateString(undefined, options);
  };

  const getCountryCode = () => {
    let countryCode = "";
    const countryId = store.relationships.countries?.data.id;
    const country = storesData?.included.find(
      (item) => item.type === "countries" && item.id === countryId
    );
    if (country && country.attributes && "code" in country.attributes) {
      countryCode = country.attributes.code.toLowerCase();
    }
    return countryCode;
  };

  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/${countryCode}.svg`;
  };

  const getTwoBestSellingBooks = (): BookType[] => {
    if (!store.relationships.books) {
      return [];
    }
    const storeBookIds = store.relationships.books.data.map((book) => book.id);
    const allBooks = storesData?.included.filter(
      (item) => item.type === "books"
    ) as BookType[];
    const storeBooks = allBooks?.filter((book) =>
      storeBookIds?.includes(book.id)
    );
    if (!storeBooks) return [];
    if (storeBooks.length < 3) {
      addAuthorToStoreBooks(storeBooks);
      return storeBooks;
    }
    storeBooks?.sort(
      (book, nextBook) =>
        nextBook.attributes.copiesSold - book.attributes.copiesSold
    );
    addAuthorToStoreBooks(storeBooks);
    return storeBooks.slice(0, 2);
  };

  const addAuthorToStoreBooks = (books: BookType[]) => {
    const allAuthors = storesData?.included.filter(
      (item) => item.type === "authors"
    ) as AuthorType[];

    books.forEach((book) => {
      const authorId = book.relationships.author?.data.id;
      const author = allAuthors.find((author) => author.id === authorId);

      if (author) {
        book.authorName = author.attributes.fullName;
      }
    });
  };

  return (
    <div className="border-t-2 my-2 mx-4 p-2">
      <div className="flex gap-6 my-4 items-center">
        <img
          src={store.attributes.storeImage}
          alt={store.attributes.name}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
        />
        <div className="w-full flex flex-col justify-between gap-4">
          <div className="sm:flex justify-between">
            <div className="font-bold text-2xl">{store.attributes.name}</div>
            <Rating storeId={store.id} />
          </div>
          <div className="border-[1px] border-neutral-200 rounded-sm p-2">
            <div className="font-semibold mb-1">Best-selling books</div>
            {getTwoBestSellingBooks().length > 0 ? (
              getTwoBestSellingBooks().map((book) => (
                <Book key={book.id} bookData={book} />
              ))
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between">
        <div className="text-sm">
          {formatDate(store.attributes.establishmentDate)} -{" "}
          <a href={store.attributes.website} className="hover:text-blue-500">
            {store.attributes.website}
          </a>
        </div>
        <img
          src={getFlagUrl(getCountryCode())}
          alt={getCountryCode()}
          className="h-6"
        />
      </div>
    </div>
  );
}
