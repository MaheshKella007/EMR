import React from 'react';
import { LabResult } from '../types';
import { FlaskConical, X, Edit3 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card } from './Card';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  labs: LabResult[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onEdit?: (lab: LabResult) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isNormal = data.interpretation?.toLowerCase() === 'normal';
    
    return (
      <div className="bg-[#1e293b] text-white p-3 rounded-lg shadow-2xl border border-slate-700 text-[11px] min-w-[150px] animate-in fade-in slide-in-from-left-2 duration-150 pointer-events-none z-[100] ring-1 ring-white/10">
        <div className="mb-2 pb-1.5 border-b border-slate-700/50 text-left">
          <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-0.5">Result Date</p>
          <p className="font-semibold text-slate-100">{data.date}</p>
        </div>
        <div className="space-y-2.5 text-left">
          <div>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-0.5">Value</p>
            <p className="font-bold text-white text-[13px] leading-tight">
              {data.value} <span className="text-slate-400 font-medium text-[10px]">{data.unit}</span>
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-0.5">Status</p>
            <span className={`inline-block px-2 py-0.5 rounded-[4px] font-bold text-[9px] uppercase tracking-wider ${
              isNormal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {data.interpretation || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const LabTrends: React.FC<Props> = ({ labs = [], onAdd, onRemove, onEdit }) => {
  const safeLabs = Array.isArray(labs) ? labs : [];

  // Group labs by test name to show trends over time
  const groupedTests = safeLabs.reduce((acc, lab) => {
    const name = lab.test_name || 'Unknown Test';
    if (!acc[name]) acc[name] = [];
    acc[name].push(lab);
    return acc;
  }, {} as Record<string, LabResult[]>);

  // Process grouped tests to prepare for rendering
  const displayTests = Object.keys(groupedTests).map(name => {
    // Sort history by date ascending for the graph
    const history = [...groupedTests[name]].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const latest = history[history.length - 1];
    
    // Prepare chart data with all metadata for the tooltip
    let chartData = history.map(h => ({ 
      value: parseFloat(h.value) || 0,
      date: h.date,
      unit: h.unit,
      interpretation: h.interpretation
    }));
    
    // If only one point, duplicate it to show a flat line trend
    if (chartData.length === 1) {
      chartData = [
        { ...chartData[0], date: 'Previous' }, 
        chartData[0]
      ];
    }
    
    return {
      name,
      latest,
      chartData
    };
  });

  const getLineColor = (interpretation?: string) => {
    const inter = interpretation?.toLowerCase();
    if (inter === 'high' || inter === 'low' || inter === 'abnormal' || inter === 'critical') return '#ef4444'; // Red
    if (inter === 'normal') return '#10b981'; // Green
    return '#f59e0b'; // Amber for warnings
  };

  return (
    <Card className="h-full flex flex-col">
      <SectionHeader 
        title="Lab Trends" 
        icon={<FlaskConical size={18} className="text-[#34d399]" />}
        actionLabel="+ Quick Lab"
        isDropdown
        menuItems={["Add Data", "Import Manual Result", "View Full History"]}
        onMenuSelect={(item) => {
          if (item === 'Add Data' && onAdd) onAdd();
        }}
      />
      
      <div className="overflow-y-auto max-h-[350px] pr-1 custom-scrollbar divide-y divide-slate-100">
        {displayTests.length === 0 && (
           <div className="text-center py-10 text-slate-300 italic text-[11px] font-medium uppercase tracking-widest">
             No recent lab trends found.
           </div>
        )}
        {displayTests.map((test, i) => {
          const lineColor = getLineColor(test.latest.interpretation);
          
          return (
            <div key={i} className="py-3 px-2 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-bold text-[#334155] truncate">{test.name}</h4>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(test.latest)}
                        className="p-0.5 hover:bg-teal-50 text-slate-300 hover:text-teal-600 rounded transition-colors"
                      >
                        <Edit3 size={11} />
                      </button>
                    )}
                    {onRemove && (
                      <button 
                        onClick={() => onRemove(test.latest.id)}
                        className="p-0.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[12px] font-bold text-[#0e7490] mt-0.5">
                  {test.latest.value} {test.latest.unit}
                </p>
              </div>

              <div className="w-24 h-12 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={test.chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ stroke: 'rgba(148, 163, 184, 0.2)', strokeWidth: 1 }}
                      wrapperStyle={{ outline: 'none', zIndex: 100 }}
                      allowEscapeViewBox={{ x: true, y: true }}
                      // Fixed horizontal position to the left of the sparkline's start
                      // Regardless of which point is hovered, the card stays at the left edge.
                      position={(point) => ({
                        x: -160,          // Fixed offset to the left of the 96px chart container
                        y: point.y - 60   // Follows vertical mouse position for context
                      })}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={lineColor} 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 4, fill: lineColor, stroke: '#fff', strokeWidth: 2 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};