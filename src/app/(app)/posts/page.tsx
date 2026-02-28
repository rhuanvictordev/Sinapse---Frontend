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

export default async function Posts() {
  const response = await fetch("https://rickandmortyapi.com/api/character",{ next: { revalidate: 300 } });
  
  const data: ApiResponse = await response.json();

  return (
    <div className="grid grid-cols-4">
      {data.results.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <img src={item.image} width={250} />
          <p>{item.species}</p>
        </div>
      ))}
    </div>
  );
}