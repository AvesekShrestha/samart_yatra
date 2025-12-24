import type { IResponse } from "@/types/response.type";
import type { IRouteResponse } from "@/types/route.type";
import { useAxios } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Home = () => {
    const api = useAxios();

    const { data, isLoading } = useQuery<IRouteResponse[]>({
        queryKey: ["routes"],
        queryFn: async () => {
            const response = await api.get("/route");
            const responseData = response.data as IResponse<IRouteResponse[]>;
            if (responseData.success && responseData.data) return responseData.data;
            else throw new Error(responseData.message);
        }
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            {data?.map((route: IRouteResponse) => (
                <Link key={route.routeId} to={`route/${route.routeId}`}>
                    <div key={route.routeId}>{route.name}</div>
                </Link>
            ))}
        </>
    );
};

export default Home;
