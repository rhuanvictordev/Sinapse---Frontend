import { unstable_cache } from "next/cache";
import { RickAPI } from "@/services/api";

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
};

type ApiResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};

const getCharacters = unstable_cache(
  async () => {
    const response = await RickAPI.get("/character");
    return response.data;
  },
  ["characters"], // chave do cache
  { revalidate: 300 } // 5 minutos
);

export default async function Posts() {
  const data: ApiResponse = await getCharacters();

  return (
    <div className="flex flex-row flex-wrap text-center justify-center gap-5">
      {data.results.map((item) => (
        <div key={item.id} className="justify-center">
          <h2>{item.name}</h2>
          <img src={item.image} width={250} className="cursor-pointer hover:rotate-x-10 hover:rotate-y-10 hover:scale-120 rounded-2xl hover:border duration-300 shadow-2xl border"/>
          <p>{item.species}</p>
        </div>
      ))}
    </div>
  );
}