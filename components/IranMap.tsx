"use client";

import { useState } from "react";
import { PROVINCES, VIEWBOX } from "./iranProvinces";

interface ProvinceData {
  name: string;
  totalMeters: number;
  dealersCount: number;
  status: "good" | "average" | "weak" | "none";
}

export default function IranMap({ data }: { data: ProvinceData[] }) {
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getProvinceData = (name: string) => {
    return data.find((d) => d.name === name) || { 
      name, 
      totalMeters: 0, 
      dealersCount: 0, 
      status: "none" as const 
    };
  };

  const getColor = (status: string) => {
    if (status === "good") return "#22c55e";     // سبز
    if (status === "average") return "#f97316";  // نارنجی
    if (status === "weak") return "#ef4444";     // قرمز
    return "#e2e8f0";                            // خاکستری روشن
  };

  const getStatusText = (status: string) => {
    if (status === "good") return "فروش عالی (بالای ۱۰۰۰ متر)";
    if (status === "average") return "فروش متوسط (بین ۳۰۰ تا ۱۰۰۰ متر)";
    if (status === "weak") return "فروش ضعیف (کمتر از ۳۰۰ متر)";
    return "بدون نماینده فعال";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8">
      {/* بخش نقشه */}
      <div 
        className="relative flex-1 flex items-center justify-center bg-blue-50/30 rounded-2xl p-4 border border-blue-100"
        onMouseMove={handleMouseMove}
      >
        <svg
          viewBox={VIEWBOX}
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-[600px] drop-shadow-md"
        >
          {PROVINCES.map((prov) => {
            const provData = getProvinceData(prov.name);
            const isHovered = hoveredProvince?.name === prov.name;
            
            return (
              <g key={prov.id}>
                <path
                  d={prov.d}
                  fill={getColor(provData.status)}
                  stroke={isHovered ? "#111827" : "#ffffff"}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeLinejoin="round"
                  className="transition-colors duration-200 cursor-pointer hover:opacity-80"
                  onMouseEnter={() => setHoveredProvince(provData)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
                <text
                  x={prov.label.x}
                  y={prov.label.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={prov.label.fontSize}
                  fontWeight="700"
                  fill="#111"
                  stroke="rgba(255,255,255,.75)"
                  strokeWidth={prov.label.fontSize * 0.18}
                  paintOrder="stroke"
                  style={{ pointerEvents: "none", userSelect: "none", fontFamily: "Vazirmatn, Tahoma, sans-serif" }}
                >
                  {prov.label.lines.map((ln, i) => (
                    <tspan key={i} x={prov.label.x} y={prov.label.y - ((prov.label.lines.length - 1) * prov.label.fontSize * 1.2) / 2 + i * prov.label.fontSize * 1.2}>
                      {ln}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>

        {/* راهنمای رنگ‌ها */}
        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-xl text-xs space-y-1.5 shadow-md border border-gray-100 z-10">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> فروش عالی</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> فروش متوسط</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> فروش ضعیف</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-300"></span> بدون نماینده</div>
        </div>

        {/* تولتیپ */}
        {hoveredProvince && (
          <div
            className="absolute bg-secondary-dark text-white p-3 rounded-xl shadow-xl border border-white/10 min-w-[180px] z-20 transition-all pointer-events-none"
            style={{
              left: tooltipPos.x + 15,
              top: tooltipPos.y + 15,
            }}
          >
            <h3 className="font-bold text-base mb-1">{hoveredProvince.name}</h3>
            <p className="text-[11px] text-white/70 mb-2">{getStatusText(hoveredProvince.status)}</p>
            <div className="flex justify-between items-center text-xs border-t border-white/10 pt-2">
              <span className="text-white/60">بارگیری:</span>
              <span className="font-black text-accent">{hoveredProvince.totalMeters.toLocaleString("fa-IR")} متر</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-white/60">تعداد نماینده:</span>
              <span className="font-bold">{hoveredProvince.dealersCount.toLocaleString("fa-IR")} نفر</span>
            </div>
          </div>
        )}
      </div>

      {/* لیست استان‌ها */}
      <div className="md:w-72 flex flex-col">
        <h2 className="text-lg font-bold text-secondary mb-4">📊 آمار استان‌ها</h2>
        <div className="space-y-2 overflow-y-auto max-h-[500px] pr-2">
          {data.length === 0 ? (
             <p className="text-sm text-muted text-center py-4">داده‌ای ثبت نشده است.</p>
          ) : (
            data.sort((a,b) => b.totalMeters - a.totalMeters).map((p) => (
              <div key={p.name} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 border border-gray-100">
                <div>
                  <div className="text-sm font-bold text-secondary">{p.name}</div>
                  <div className="text-[10px] text-muted">{p.dealersCount} نماینده</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold" style={{ color: getColor(p.status) }}>
                    {p.totalMeters.toLocaleString("fa-IR")} متر
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}