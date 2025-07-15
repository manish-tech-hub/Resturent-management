import React from 'react';
import './css/chart.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const salesData = [
  { month: 'Jan', sales: 4000, revenue: 2400, expenses: 1800 },
  { month: 'Feb', sales: 3000, revenue: 1398, expenses: 1200 },
  { month: 'Mar', sales: 5000, revenue: 3800, expenses: 2500 },
  { month: 'Apr', sales: 4780, revenue: 3908, expenses: 2200 },
  { month: 'May', sales: 5890, revenue: 4800, expenses: 3200 },
  { month: 'Jun', sales: 4390, revenue: 3800, expenses: 2800 },
];

const productData = [
  { name: 'Pizza', stock: 40 },
  { name: 'Burger', stock: 30 },
  { name: 'Momo', stock: 20 },
  { name: 'Chawmin', stock: 27 },
  { name: 'Chicken Chilli', stock: 18 },
];

// Color scheme
const COLORS = ['#4e73df', '#1cc88a', '#f6c23e']; // Blue, Green, Yellow
const BAR_COLORS = ['#36b9cc', '#5a5c69'];         // Teal, Gray
const LINE_COLOR = '#4e73df';                      // Blue
const AREA_COLORS = ['#4e73df', '#e74a3b'];        // Blue, Red

const DashboardCharts = ({ deliverPercent, pendingPercent, cancelledPercent }) => {
  const ordersData = [
    { name: "Delivered", value: deliverPercent },
    { name: "Pending", value: pendingPercent },
    { name: "Cancelled", value: cancelledPercent },
  ];
  return (
    <div className="charts-container">
      {/* 1. Line Chart (Sales Overview) - Original */}
      <div className="chart-card">
        <div className="chart-header" style={{ borderLeftColor: LINE_COLOR }}>
          <h3 className="chart-title">Sales Overview</h3>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fill: '#5a5c69' }} axisLine={{ stroke: '#d1d3e2' }}/>
              <YAxis tick={{ fill: '#5a5c69' }} axisLine={{ stroke: '#d1d3e2' }}/>
              <Tooltip contentStyle={{
                background: '#ffffff',
                border: '1px solid #e3e6f0',
                borderRadius: '0.35rem',
                boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)'
              }}/>
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke={LINE_COLOR}
                strokeWidth={2}
                dot={{ fill: LINE_COLOR, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#2e59d9' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Bar Chart (Product Stock) - Original */}
      <div className="chart-card">
        <div className="chart-header" style={{ borderLeftColor: BAR_COLORS[0] }}>
          <h3 className="chart-title">Product Stock Levels</h3>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fill: '#5a5c69' }} axisLine={{ stroke: '#d1d3e2' }}/>
              <YAxis tick={{ fill: '#5a5c69' }} axisLine={{ stroke: '#d1d3e2' }}/>
              <Tooltip contentStyle={{
                background: '#ffffff',
                border: '1px solid #e3e6f0',
                borderRadius: '0.35rem',
                boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)'
              }}/>
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              <Bar dataKey="stock" radius={[4, 4, 0, 0]} animationDuration={1500}>
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Pie Chart (Order Status) - Original */}
      <div className="chart-card">
        <div className="chart-header" style={{ borderLeftColor: COLORS[2] }}>
          <h3 className="chart-title">Order Status</h3>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={ordersData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80}
                innerRadius={50}
                paddingAngle={5}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {ordersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} orders`, name]} 
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e3e6f0',
                  borderRadius: '0.35rem',
                  boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)'
                }}/>
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. NEW Area Chart (Revenue vs Expenses) */}
      <div className="chart-card">
        <div className="chart-header" style={{ borderLeftColor: AREA_COLORS[0] }}>
          <h3 className="chart-title">Revenue vs Expenses</h3>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fill: '#5a5c69' }} axisLine={{ stroke: '#d1d3e2' }}/>
              <YAxis tick={{ fill: '#5a5c69' }} axisLine={{ stroke: '#d1d3e2' }}/>
              <Tooltip contentStyle={{
                background: '#ffffff',
                border: '1px solid #e3e6f0',
                borderRadius: '0.35rem',
                boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)'
              }}/>
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1"
                stroke={AREA_COLORS[0]}
                fill={AREA_COLORS[0]}
                fillOpacity={0.2}
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="1"
                stroke={AREA_COLORS[1]}
                fill={AREA_COLORS[1]}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;