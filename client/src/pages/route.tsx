import type { IResponse } from "@/types/response.type";
import type { IRouteResponse } from "@/types/route.type";
import { useAxios } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

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
                <div key={route.routeId}>{route.name}</div>
            ))}
        </>
    );
};

export default Home;
