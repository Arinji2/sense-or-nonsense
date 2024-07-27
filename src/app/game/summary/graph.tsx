"use client";

import React from "react";
import { useMediaQuery } from "react-responsive";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SummaryGraphPoints } from "../../../../validations/generic/types";

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string | number;
  fields: {
    label: string;
    suffix?: string;
  }[];
  labelDisplay: string;
};

// Custom tooltip component
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  fields,
  labelDisplay,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-sm bg-black p-2 text-white">
        <p className="text-sm font-medium tracking-text text-white">
          {labelDisplay}: <span className="inline text-blue-500">{label}</span>
        </p>
        {fields.map((field, index) => (
          <p
            className="text-sm font-medium tracking-text text-white"
            key={index}
          >
            {field.label}:{" "}
            <span className="inline text-blue-500">{`${payload[index].value}${field.suffix ?? ""}`}</span>
          </p>
        ))}
      </div>
    );
  }

  return null;
};

function GraphWrapper({ children, title }: { children: any; title: string }) {
  return (
    <div className="flex h-[400px] w-full flex-col items-start justify-start gap-6 xl:h-full">
      <h2 className="text-[30px] font-medium tracking-subtitle text-white">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function TimeGraph({
  data,
  minTimeLeft,
  maxTimeLeft,
}: {
  data: SummaryGraphPoints[];
  minTimeLeft: number;
  maxTimeLeft: number;
}) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  return (
    <GraphWrapper title="TIME LEFT VS ROUNDS">
      <LineChart
        data={data}
        margin={{
          top: -20,
          right: 0,
          left: isTabletOrMobile ? -30 : 0,
          bottom: -10,
        }}
      >
        <CartesianGrid stroke="rgba(255, 255, 255, 0.2)" strokeWidth={2} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: 10 }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#22c55e"
          name="Time Left"
          strokeWidth={3}
        />
        <XAxis dataKey="x">
          <Label value="Rounds" offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label
            value="Time Left (s)"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
            className="hidden md:block"
          />
        </YAxis>
        <Tooltip
          content={
            <CustomTooltip
              labelDisplay="ROUND"
              fields={[
                {
                  label: "TIME LEFT",
                  suffix: "s",
                },
              ]}
            />
          }
        />
        <ReferenceLine
          y={minTimeLeft}
          label={{
            value: `Min Time Left: ${minTimeLeft}s`,
            position: "insideBottomRight",
            style: { fill: "#22c55e", fontSize: "12px" },
            dy: maxTimeLeft - minTimeLeft < 4 ? 20 : 0,
          }}
          stroke="#22c55e"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={maxTimeLeft}
          label={{
            value: `Max Time Left: ${maxTimeLeft}s`,
            position: "insideTopRight",
            style: { fill: "#22c55e", fontSize: "12px" },
            dy: maxTimeLeft - minTimeLeft < 4 ? -20 : 0,
          }}
          stroke="#22c55e"
          strokeDasharray="3 3"
        />
      </LineChart>
    </GraphWrapper>
  );
}

export function AccuracyGraph({
  data,
  maxAccuracy,
  maxStreak,
}: {
  data: SummaryGraphPoints[];
  maxAccuracy: number;
  maxStreak: {
    value: number;
    round: number;
  };
}) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  return (
    <GraphWrapper title="ACCURACY VS ROUNDS">
      <LineChart
        data={data}
        margin={{
          top: -20,
          right: 0,
          left: isTabletOrMobile ? -30 : 0,
          bottom: -10,
        }}
      >
        <CartesianGrid stroke="rgba(255, 255, 255, 0.2)" strokeWidth={2} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: 10 }}
        />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke="#3b82f6"
          name="Accuracy"
          strokeWidth={3}
        />
        <XAxis dataKey="x">
          <Label value="Rounds" offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label
            value="Accuracy (%)"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip
          content={
            <CustomTooltip
              labelDisplay="ROUND"
              fields={[
                {
                  label: "ACCURACY",
                  suffix: "%",
                },
              ]}
            />
          }
        />
        <ReferenceLine
          y={maxAccuracy}
          label={{
            value: `Max Accuracy: ${maxAccuracy}%`,
            position: "insideTopRight",
            style: {
              fill: "#3b82f6",
              fontSize: "12px",
            },
          }}
          stroke="#3b82f6"
          strokeDasharray="3 3"
        />

        <ReferenceLine
          x={maxStreak.round}
          label={{
            value: `Max Streak: ${maxStreak.value}`,
            position: "insideTopRight",
            style: { fill: "#d946ef", fontSize: "12px" },
            dy: maxStreak.round === data.length ? 20 : 0,
          }}
          stroke="#d946ef"
          strokeDasharray="3 3"
        />
      </LineChart>
    </GraphWrapper>
  );
}
