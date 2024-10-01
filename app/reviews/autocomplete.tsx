import React, { useState, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Place = {
  id: string;
  place_name: string;
  address_name: string;
  phone: string;
  place_url: string;
  x: string;
  y: string;
};

type AutocompleteProps = {
  onSelect: (value: string) => void;
};

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchPlaces = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/company-search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch places from API");
      }

      const data = await response.json();

      if (!data.documents || data.documents.length === 0) {
        setResults([]);
      } else {
        setResults(data.documents);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (newQuery) {
        fetchPlaces(newQuery);
      } else {
        setResults([]);
      }
    }, 400);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="w-full"
        placeholder="Search for a company name..."
      />
      <p className="text-sm mt-1 text-muted-foreground">
        직장명을 초성으로 제출하시면 후기가 반려될 수 있어요.
      </p>

      {isLoading && (
        <div className="absolute top-full mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg w-full">
          Loading...
        </div>
      )}
      {results.length > 0 && (
        <Card className="absolute top-full mt-2 bg-white border border-gray-300 rounded shadow-lg w-full max-h-60 overflow-y-auto z-50">
          <ul>
            {results.map((place) => (
              <li
                key={place.id}
                onClick={() => {
                  onSelect(place.place_name);
                  setQuery(place.place_name);
                  setResults([]);
                }}
                className="p-2 cursor-pointer hover:bg-gray-100">
                <p className="font-bold">{place.place_name}</p>
                <p className="text-sm text-gray-500">{place.address_name}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default Autocomplete;
