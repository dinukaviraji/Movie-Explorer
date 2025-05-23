import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_Key;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getTrendingMovies = async (page=1) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: API_KEY , page},
    });
    return res.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const getMovieDetails = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }

  };
  
  export const getMovieCredits = async (id) => {

    try {
      const res = await axios.get(`${BASE_URL}/movie/${id}/credits`, {
        params: { api_key: API_KEY },
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
 
  };
  
  export const getMovieVideos = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${id}/videos`, {
        params: { api_key: API_KEY },
      });
      return res.data.results;
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return [];
    }

  };

  export const getBackdrops = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${id}/images`, {
        params: { api_key: API_KEY },
      });
      return res.data.backdrops;
      
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  };

// Get genres list
export const getGenres = async () => {
  const res = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: { api_key: API_KEY }
  });
  return res.data;
};

// Get popular movies
export const getPopularMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/popular`, {
    params: { api_key: API_KEY }
  });
  return res.data;
};

// Discover movies with filters
export const discoverMovies = async ({ genre, year, rating }) => {
  const res = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      with_genres: genre || undefined,
      primary_release_year: year || undefined,
      'vote_average.gte': rating || undefined,
      sort_by: 'popularity.desc'
    }
  });
  return res.data;
};


export const searchMovieByName = async (query) => {

  const res = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query,
    },
  });
  console.log('Search results:', res.data.results);
  return res.data.results; // array of matching movies
};
