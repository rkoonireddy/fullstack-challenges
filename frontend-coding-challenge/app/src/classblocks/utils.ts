// interface is similar to defining a class/ object these will be used through out the program as we will see it
// the api provides objects with following attribiutes:
// 1. Object
//     2. type: stores, books, countries, authors (4)

//         within stores:
//             attr: name, website, rating, storeimage, establishmentDate
//             books
//             attr: name, copiesSold
//             countries
//             attr: code
//         within books
//             authors
//             attr: fullname
//             copies sold
//         within countries
//             only country blocks
//         within authors
//             only authors


// this is the raw input from API
export interface ApiInputStore {
  children: React.ReactNode;
}

//this sets stores datatype
export interface StoresDataContextType {
  storesData?: StoresData | null;
  setStoresData?:
    | React.Dispatch<React.SetStateAction<StoresData>>
    | React.Dispatch<React.SetStateAction<null>>;
}

//sets store representation
export interface StoresData {
  data: Store[];
  included: (Country | Author | Book)[];
  jsonapi: { version: string };
  meta: { total: string };
}

//sets props for store
export interface StoreProps {
  store: Store;
}

export interface Store {
  type: "stores";
  id: string;
  attributes: StoreAttributes;
  relationships: Relationships;
}

export interface StoreAttributes {
  name: string;
  website: string;
  rating: number;
  storeImage: string;
  establishmentDate: string;
}

export interface Country {
  id: string;
  type: "countries";
  attributes: { code: string };
}

export interface Author {
  id: string;
  type: "authors";
  attributes: { fullName: string };
}

export interface BookProps {
  bookData: Book;
}

export interface Book {
  type: "books";
  id: string;
  attributes: { name: string; copiesSold: number };
  relationships: Relationships;
  authorName?: string;
}

export interface Relationships {
  countries?: { data: { id: string; type: "countries" } };
  author?: { data: { id: string; type: "authors" } };
  books?: { data: { id: string; type: "books" }[] };
}

export interface RatingProps {
  storeId: string;
}
