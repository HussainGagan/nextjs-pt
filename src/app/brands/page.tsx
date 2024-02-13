import AddBrand from "@/components/AddBrand";
import DeleteBrand from "@/components/DeleteBrand";
import EditBrand from "@/components/EditBrand";
import { getBrands } from "@/actions/brandActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

async function Brands() {
  const brands = await getBrands();
  const session = await getServerSession(authOptions);

  return (
    <div className="pb-16">
      <h1 className="text-xl font-bold">All Available brands</h1>
      {session ? (
        <AddBrand />
      ) : (
        <p className="text-lg">
          You need to sign in before performing any operations
        </p>
      )}
      {brands.map((brand, i) => (
        <div key={brand.id} className="border-b-2 border-violet-400 p-4">
          <div>
            {i + 1}. Name: <span>{brand.name}</span>
          </div>
          <div>
            Brand Website:{" "}
            {brand.website ? (
              <a
                href={brand.website as string}
                className="text-violet-400"
                target="_blank"
              >
                {brand.website}
              </a>
            ) : (
              <span>No Website</span>
            )}
          </div>
          <div>
            {session ? (
              <>
                <EditBrand brand={brand} />
                <DeleteBrand brand_id={brand.id} />
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Brands;
