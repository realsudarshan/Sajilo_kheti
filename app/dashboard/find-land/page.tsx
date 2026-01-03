
import { DashboardEssential } from "@/components/dashboard/essential"
import { LandCard } from '@/components/dashboard/LandCard'
import { Landtype } from "@/types/landstype"
const lands: Landtype[] = [
  {
    landtitle: "Land Title 1",
    landdescription: "This is a description for Land 1",
    landlocation: "Location 1",
    landownername: "owner 1",
    landphoto:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
    landownerphoto: "https://i.pravatar.cc/150?img=1",
    pricing: "price 1",
    purpose: "purpose 1",
    size: "size 1",
  },
  {
    landtitle: "Land Title 2",
    landdescription: "This is a description for Land 2",
    landlocation: "Location 2",
    landownername: "owner 2",
    landphoto:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
    landownerphoto: "https://i.pravatar.cc/150?img=2",
    pricing: "price 2",
    purpose: "purpose 2",
    size: "size 2",
  },
  {
    landtitle: "Land Title 3",
    landdescription: "This is a description for Land 3",
    landlocation: "Location 3",
    landownername: "owner 3",
    landphoto:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200",
    landownerphoto: "https://i.pravatar.cc/150?img=3",
    pricing: "price 3",
    purpose: "purpose 3",
    size: "size 3",
  },
  {
    landtitle: "Land Title 4",
    landdescription: "This is a description for Land 4",
    landlocation: "Location 4",
    landownername: "owner 4",
    landphoto:
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200",
    landownerphoto: "https://i.pravatar.cc/150?img=4",
    pricing: "price 4",
    purpose: "purpose 4",
    size: "size 4",
  },
  {
    landtitle: "Land Title 5",
    landdescription: "This is a description for Land 5",
    landlocation: "Location 5",
    landownername: "owner 5",
    landphoto:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",
    landownerphoto: "https://i.pravatar.cc/150?img=5",
    pricing: "price 5",
    purpose: "purpose 5",
    size: "size 5",
  },
];

export default function FindLand() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardEssential />
<LandCard lands={lands}/>
      <div className="mt-8">
        <p className="text-sm text-gray-600">No results yet. Use the search above to find available land listings.</p>
      </div>
    </div>
  )
}
