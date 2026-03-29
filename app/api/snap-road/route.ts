import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { lat, lng } = await req.json();
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        // Using the Google Roads API to snap points to the nearest road
        const url = `https://roads.googleapis.com/v1/snapToRoads?path=${lat},${lng}&key=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.snappedPoints && data.snappedPoints.length > 0) {
            const point = data.snappedPoints[0].location;
            return NextResponse.json({
                lat: point.latitude,
                lng: point.longitude,
            });
        }

        // Fallback: if no road is found, return original coords
        return NextResponse.json({ lat, lng });
    } catch (err) {
        console.error("Snap API error:", err);
        return NextResponse.json({ error: "Snap failed" }, { status: 500 });
    }
}