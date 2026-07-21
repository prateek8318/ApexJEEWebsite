"use client";

import React, { useMemo } from "react";
import { defineStepper } from "@stepperize/react";

type StepperProps = {
  title?: string;
  steps: Steps[];
  children: (nav: {
    currentStepId: string;
    next: () => void;
    prev: () => void;
  }) => React.ReactNode;
};

export function Stepper({ title, steps, children }: StepperProps) {
  const { useStepper } = useMemo(() => defineStepper(...steps), [steps]);

  const stepper = useStepper();

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 max-w-7xl mx-auto w-full lg:h-full p-2 sm:p-4 lg:p-0 lg:overflow-hidden">
      {/* Step Header */}
      <div className="flex flex-col lg:w-72 shrink-0 pt-0 lg:pt-4 overflow-y-auto no-scrollbar">
        {title && (
          <h3 className="text-muted-foreground text-xs lg:text-sm font-semibold mb-4 lg:mb-6 uppercase tracking-wider hidden lg:block">
            {title}
          </h3>
        )}

        {/* Mobile: Horizontal scrollable steps with current step label */}
        <div className="lg:hidden flex flex-col gap-2 pb-4 pt-2">
          <div className="flex overflow-x-auto gap-2 no-scrollbar scroll-smooth items-center">
            {stepper.state.all.map((stepItem, index) => {
              const isCurrent = index === stepper.state.current.index;
              const isCompleted = index < stepper.state.current.index;

              return (
                <div key={stepItem.id} className="shrink-0 flex items-center gap-1">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2
                    ${
                      isCurrent
                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-110"
                        : isCompleted
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-transparent"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < stepper.state.all.length - 1 && (
                    <div className={`w-4 sm:w-6 h-0.5 ${isCompleted ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-sm font-semibold text-primary truncate">
            {stepper.state.current.data.title}
          </p>
        </div>

        {/* Desktop: Vertical Steps */}
        <div className="hidden lg:flex flex-col relative space-y-5">
          {stepper.state.all.map((stepItem, index) => {
            const isCurrent = index === stepper.state.current.index;
            const isCompleted = index < stepper.state.current.index;
            const isLast = index === stepper.state.all.length - 1;

            return (
              <div
                key={stepItem.id}
                className="flex items-start gap-4 relative"
              >
                {/* Vertical connecting line */}
                {!isLast && (
                  <div
                    className={`absolute left-5 top-10 -bottom-5 w-0.5 z-0 transition-colors duration-200
                      ${isCompleted ? "bg-primary" : "bg-border"}`}
                  />
                )}

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-medium z-10 shrink-0 transition-colors duration-200
                  ${
                    isCompleted
                      ? "bg-primary text-primary-foreground border-primary"
                      : isCurrent
                        ? "bg-background text-primary border-primary"
                        : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex flex-col pt-2">
                  <p
                    className={`text-base transition-colors duration-200 ${isCurrent ? "font-semibold text-primary" : isCompleted ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {stepItem.title}
                  </p>
                  {stepItem.description && (
                    <p
                      className={`text-xs mt-1 transition-colors duration-200 ${isCurrent ? "text-muted-foreground" : "text-muted-foreground"}`}
                    >
                      {stepItem.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col overflow-hidden lg:flex-1 lg:min-h-0">
        {children({
          currentStepId: stepper.state.current.data.id as string,
          next: stepper.navigation.next,
          prev: stepper.navigation.prev,
        })}
      </div>
    </div>
  );
}
