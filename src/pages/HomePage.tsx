import Stack from "@mui/material/Stack";
import { COMMON_TITLES } from "src/constant";
import ListingGrid from "src/components/ListingGrid";
import { genreSliceEndpoints, useGetGenresQuery } from "src/store/slices/genre";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import store from "src/store";

export async function loader() {
  await store.dispatch(
    genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Movie)
  );
  return null;
}

function HomePage() {
  const { data: genres, isSuccess } = useGetGenresQuery(MEDIA_TYPE.Movie);

  if (isSuccess && genres && genres.length > 0) {
    return (
      <Stack spacing={2}>
        <ListingGrid />
      </Stack>
    );
  }
  return null;
}

HomePage.displayName = "HomePage";

export default HomePage;
