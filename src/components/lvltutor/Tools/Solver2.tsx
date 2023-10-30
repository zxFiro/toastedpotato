import React, { useState, memo, useEffect, useRef } from "react";

import {
  Flex,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Alert,
  Text,
  AlertIcon,
  HStack,
  VStack,
} from "@chakra-ui/react";

//la siguiente linea se utiliza para el wraper del componente Mq, el cual usa la libreria JS mathquill
import dynamic from "next/dynamic";

//reporte de acciones
//import { useAction } from "../../../utils/action";

import type { ExType, Step } from "./ExcerciseType";

import { useSnapshot } from "valtio";
import MQProxy, { reset } from "./MQProxy";
import MQStaticMathField from "../../../utils/MQStaticMathField";

const Mq2 = dynamic(
  () => {
    return import("./Mq2");
  },
  { ssr: false },
);

interface value {
  ans: string;
  att: number;
  hints: number;
  lasthint: boolean;
  fail: boolean;
  duration: number;
}
interface potato {
  disabled: boolean;
  hidden: boolean;
  answer: boolean;
  value: value;
  open: boolean;
}

const Steporans = ({
  step,
  topicId,
  content,
  i,
  answer,
}: {
  step: Step;
  topicId: string;
  content: string;
  i: number;
  answer?: string;
}) => {
  const [currentComponent, setCC] = useState(<></>);
  useEffect(() => {
    if (answer && answer != "") {
      setCC(
        <>
          <MQStaticMathField key={"respuesta" + i} exp={answer} currentExpIndex={true} />
          <Alert key={"Alert" + topicId + "i"} status={"success"} mt={2}>
            <AlertIcon key={"AlertIcon" + topicId + "i"} />
            {step.correctMsg}
          </Alert>
        </>,
      );
    } else {
      setCC(
        <Mq2 key={"Mq2" + i} step={step} content={content} topicId={topicId} disablehint={false} />,
      );
    }
  }, [, answer]);

  return currentComponent;
};

const Solver2 = ({ topicId, steps }: { topicId: string; steps: ExType }) => {
  const mqSnap = useSnapshot(MQProxy);

  //const action = useAction();
  const currentStep = useRef(0);

  const cantidadDePasos = steps.steps.length;

  let potatoStates: Array<potato> = [
    {
      disabled: false,
      hidden: false,
      answer: false,
      value: {
        ans: "",
        att: 0,
        hints: 0,
        lasthint: false,
        fail: false,
        duration: 0,
      },
      open: true,
    },
  ];

  for (let i = 1; i < cantidadDePasos; i++) {
    potatoStates.push({
      disabled: true,
      hidden: false,
      answer: false,
      value: {
        ans: "",
        att: 0,
        hints: 0,
        lasthint: false,
        fail: false,
        duration: 0,
      },
      open: true,
    });
  }

  const [test, setTest] = useState<Array<potato>>(potatoStates);
  const [resumen, setResumen] = useState(true);

  useEffect(() => {
    reset();
    MQProxy.startDate = Date.now();
    MQProxy.content = steps.code;
    MQProxy.topicId = topicId;
    /*action({
      verbName: "loadContent",
      contentID: steps?.code,
      topicID: topicId,
    });*/
  }, []);

  useEffect(() => {
    if (mqSnap.submit) {
      if (!mqSnap.submitValues.fail) {
        currentStep.current = mqSnap.defaultIndex[0]!;
        let currentStepValue = test;
        let duration = (MQProxy.endDate - MQProxy.startDate) / 1000;
        let sv = MQProxy.submitValues;
        sv.duration = duration;
        MQProxy.startDate = Date.now();
        currentStepValue[mqSnap.defaultIndex[0]! - 1] = {
          disabled: false,
          hidden: false,
          answer: true,
          value: sv,
          open: false,
        };
        if (mqSnap.defaultIndex[0]! < cantidadDePasos) {
          currentStepValue[mqSnap.defaultIndex[0]!] = {
            disabled: false,
            hidden: false,
            answer: false,
            value: {
              ans: "",
              att: 0,
              hints: 0,
              lasthint: false,
              fail: false,
              duration: 0,
            },
            open: true,
          };
        } else {
          let completecontent: Array<value> = [];
          for (let i = 0; i < test.length; i++) {
            const value = currentStepValue[i];
            if (!value) continue;
            completecontent.push(value.value);
          }
          let extra = {
            steps: Object.assign({}, completecontent),
          };
          /*action({
            verbName: "completeContent",
            result: 1,
            contentID: steps?.code,
            topicID: topicId,
            extra: extra,
          });*/
          setResumen(false);
        }
        setTest(currentStepValue);
      }
      MQProxy.submit = false;
    }
  }, [mqSnap.submit]);

  return (
    <Flex alignItems="center" justifyContent="center" margin={"auto"}>
      <Flex
        direction="column"
        p={12}
        rounded={6}
        w="100%"
        maxW="3xl"
        alignItems="center"
        justifyContent="center"
        margin={"auto"}
      >
        <Heading as="h1" size="lg" noOfLines={3}>
          {steps.title}
        </Heading>
        <Heading as="h5" size="sm" mt={2}>
          {steps.text}
        </Heading>
        <MQStaticMathField exp={steps.steps[0]?.expression || ""} currentExpIndex={true} />
        <Accordion
          onChange={algo => (MQProxy.defaultIndex = algo as Array<number>)}
          index={MQProxy.defaultIndex}
          allowToggle={true}
          allowMultiple={true}
        >
          {steps.steps.map((step, i) => (
            <AccordionItem
              key={"AccordionItem" + i}
              isDisabled={test[parseInt(step.stepId)]?.disabled}
              hidden={test[parseInt(step.stepId)]?.hidden}
            >
              <h2 key={"AIh2" + i}>
                <Alert
                  key={"AIAlert" + i}
                  status={test[parseInt(step.stepId)]?.answer ? "success" : "info"}
                >
                  <AccordionButton
                    key={"AIAccordionButton" + i}
                    onClick={() => {
                      let potstates = test;
                      let potstate = potstates[parseInt(step.stepId)];
                      if (potstate) {
                        if (!potstate.open) {
                          /*action({
                            verbName: "openStep",
                            stepID: "" + i,
                            contentID: steps?.code,
                            topicID: topicId,
                          });*/
                          potstate.open = true;
                          potstates[parseInt(step.stepId)] = potstate;
                          setTest(potstates);
                        } else {
                          /*action({
                            verbName: "closeStep",
                            stepID: "" + i,
                            contentID: steps?.code,
                            topicID: topicId,
                          });*/
                          potstate.open = false;
                          potstates[parseInt(step.stepId)] = potstate;
                          setTest(potstates);
                        }
                      }
                    }}
                  >
                    <Box key={"AIBox" + i} flex="1" textAlign="left">
                      {step.stepTitle}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Alert>
              </h2>
              <AccordionPanel key={"AIAccordionPanel" + i} pb={4}>
                <Steporans
                  step={step}
                  topicId={topicId}
                  content={steps.code}
                  i={i}
                  answer={test[parseInt(step.stepId)]?.value?.ans}
                />
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
        <Box>
          <Alert status="info" hidden={resumen} alignItems="top">
            <AlertIcon />
            <VStack w="100%" align="left">
              <Heading fontSize="xl">
                Resumen
              </Heading>
              <HStack>
                <Text>Expresión:</Text>
                <MQStaticMathField exp={steps.steps[0]!.expression} currentExpIndex={!resumen} />
              </HStack>
              {steps.steps.map((step, i) => (
                <Box key={"ResumenBox" + i}>
                  <Text key={"ResumenText" + i} w="100%" justifyContent={"space-between"}>
                    {step.summary}
                  </Text>
                  <MQStaticMathField
                    key={"ResumenMC" + i}
                    exp={step.displayResult[0]!}
                    currentExpIndex={!resumen}
                  />
                </Box>
              ))}
            </VStack>
          </Alert>
        </Box>
        {!resumen }
      </Flex>
    </Flex>
  );
};

export default memo(Solver2);
