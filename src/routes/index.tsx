import { Navigate, createBrowserRouter } from "react-router-dom";
import { MAIN_PATH } from "src/constant";
import MainLayout from "src/layouts/MainLayout";
import HomePage from "src/pages/HomePage";
import ListingDetail from "src/pages/ListingDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: MAIN_PATH.root,
        element: <Navigate to={`/${MAIN_PATH.browse}`} />,
      },
      {
        path: MAIN_PATH.browse,
        element: <HomePage />,
        loader: () => import("src/pages/HomePage").then(module => module.loader()),
      },
      {
        path: "listing/:id",
        element: <ListingDetail />,
      },
      {
        path: MAIN_PATH.genreExplore,
        children: [
          {
            path: ":genreId",
            lazy: () => import("src/pages/GenreExplore"),
          },
        ],
      },
      {
        path: MAIN_PATH.watch,
        lazy: () => import("src/pages/WatchPage"),
      },
    ],
  },
]);

export default router;
