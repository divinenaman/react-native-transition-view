import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

function TransitionLayer({
  layerNumber,
  containerWidth,
  containerStyle = {},
  children,
}) {
  return <View style={[containerStyle]}>{children}</View>;
}

function TransitionComponent({
  children,
  layers = 0,
  containerStyle = {},
  visibleWidthDuration = 500,
  hiddenWidthDuration = 1000,
  visibleZindexDuration = 300,
  hiddenZindexDuration = 400,
}) {
  const currentLayer = useRef(0);
  const previousLayer = useRef(null);

  const animatedWidthValues = useRef(
    Array(layers)
      .fill(0)
      .map((x) => useSharedValue(0))
  );

  const animatedZIndexValues = useRef(
    Array(layers)
      .fill(0)
      .map((x) => useSharedValue(0))
  );

  const checkIfLayerValid = (l) => {
    return l != null && l >= 0 && l < layers;
  };

  const setCurrentLayer = (transitionLayer) => {
    currentLayer.current = transitionLayer;

    if (checkIfLayerValid(previousLayer.current)) {
      if (currentLayer.current != previousLayer.current) {
        animatedZIndexValues.current[previousLayer.current].value = withTiming(
          0,
          {
            duration: hiddenZindexDuration,
          }
        );
        animatedWidthValues.current[previousLayer.current].value = withTiming(
          0,
          {
            duration: hiddenWidthDuration,
          }
        );
      }
    }

    if (checkIfLayerValid(currentLayer.current)) {
      if (currentLayer.current != previousLayer.current) {
        animatedZIndexValues.current[currentLayer.current].value = withTiming(
          1,
          {
            duration: visibleZindexDuration,
          }
        );
        animatedWidthValues.current[currentLayer.current].value = withTiming(
          100,
          {
            duration: visibleWidthDuration,
          }
        );
      }
    }

    previousLayer.current = currentLayer.current;
  };

  const preprocessChildren = () => {
    return React.Children.map(children, (child, _) => {
      const layerNumber = parseInt(child.props?.layerNumber || 0);
      const containerWidthRaw = (
        child.props.containerWidth || "100%"
      ).toString();

      function processWidth(containerWidth) {
        const containerWidthRaw = (containerWidth || "100%").toString();

        let unit = "%";
        let containerWidthValue = 100;

        if (containerWidthRaw.endsWith("%")) {
          containerWidthValue = parseFloat(
            containerWidthRaw.slice(0, containerWidthRaw.length - 1)
          );
        } else if (containerWidthRaw.endsWith("px")) {
          containerWidthValue = parseFloat(
            containerWidthRaw.slice(0, containerWidthRaw.length - 2)
          );
          unit = "px";
        }

        return { containerWidthValue, unit };
      }

      function getAnimatedStyles({ containerWidth, transitionStyle }) {
        const { containerWidthValue, unit } = processWidth(containerWidth);
        if (transitionStyle == "slide") {
          return useAnimatedStyle(() => {
            const animatedWidthValue = interpolate(
              animatedWidthValues.current[layerNumber].value,
              [0, 100],
              [0, containerWidthValue]
            );

            return {
              width: animatedWidthValue + unit,
              zIndex: animatedZIndexValues.current[layerNumber].value,
              opacity: animatedZIndexValues.current[layerNumber].value * 100,
            };
          });
        } else {
          return useAnimatedStyle(() => {
            return {
              width: containerWidthValue + unit,
              zIndex: animatedZIndexValues.current[layerNumber].value,
              opacity: animatedZIndexValues.current[layerNumber].value,
            };
          });
        }
      }

      const { containerWidthValue, unit } = processWidth(containerWidthRaw);

      const containerAnimatedStyles = useAnimatedStyle(() => {
        return {
          width: containerWidthValue + unit,
          zIndex: animatedZIndexValues.current[layerNumber].value,
          opacity: animatedZIndexValues.current[layerNumber].value,
        };
      });

      return (
        <Animated.View
          style={[
            { position: "absolute" },
            { ...child.props.containerStyle },
            containerAnimatedStyles,
          ]}
        >
          {React.Children.map(child.props.children, (child, _) => {
            return React.cloneElement(child, {
              ...child.props,
              setVisibleLayer: setCurrentLayer,
              getAnimatedStyles,
            });
          })}
        </Animated.View>
      );
    });
  };

  useEffect(() => {
    setCurrentLayer(0);
  }, []);

  return (
    <Animated.View style={containerStyle}>{preprocessChildren()}</Animated.View>
  );
}

function TransitionElement({ children, containerStyle }) {
  return <Animated.View style={[containerStyle]}>{children}</Animated.View>;
}

function TransitionButton({ children, bgColor = "black", color = "#fff" }) {
  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <Text style={{ color, paddingVertical: 15 }}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 1,
  },
});

export {
  TransitionComponent,
  TransitionLayer,
  TransitionElement,
  TransitionButton,
};
