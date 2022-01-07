import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

function TransitionLayer({
  layerNumber,
  switchLayerOnPress,
  onPress,
  transitionType,
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
}) {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [previousLayer, setPreviousLayer] = useState(null);

  const animatedWidthValues = Array(layers)
    .fill(0)
    .map((x) => useSharedValue(0));

  const animatedZIndexValues = Array(layers)
    .fill(0)
    .map((x) => useSharedValue(0));

  const checkIfLayerValid = (l) => {
    return l != null && l >= 0 && l < layers;
  };

  const preprocessChildren = () => {
    return React.Children.map(children, (child, _) => {
      const transitionType = child.props.transitionType || "slide";
      const layerNumber = parseInt(child.props?.layerNumber || 0);
      const switchLayerOnPress = parseInt(child.props?.switchLayerOnPress || 0);
      const onPress = child.props?.onPress;

      const containerWidthRaw = (
        child.props?.containerWidth || "100%"
      ).toString();

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

      let onPressHandler = null;
      if (onPress != null || checkIfLayerValid(switchLayerOnPress)) {
        onPressHandler = () => {
          if (switchLayerOnPress != layerNumber) {
            setCurrentLayer(switchLayerOnPress);
          }

          if (onPress) {
            onPress();
          }
        };
      }

      let animatedStyle = {};

      if (transitionType == "slide") {
        animatedStyle = useAnimatedStyle(() => {
          const animatedWidthValue = interpolate(
            animatedWidthValues[layerNumber].value,
            [0, 100],
            [0, containerWidthValue]
          );

          return {
            width: animatedWidthValue + unit,
            zIndex: animatedZIndexValues[layerNumber].value,
            opacity: animatedZIndexValues[layerNumber].value * 100,
          };
        });
      } else {
        animatedStyle = useAnimatedStyle(() => {
          return {
            width: containerWidthValue + unit,
            zIndex: animatedZIndexValues[layerNumber].value,
            opacity: animatedZIndexValues[layerNumber].value,
          };
        });
      }

      return (
        <Animated.View
          style={[
            { position: "absolute" },
            { ...child.props.containerStyle },
            animatedStyle,
          ]}
        >
          {onPressHandler ? (
            <Pressable onPress={onPressHandler}>
              {child.props.children}
            </Pressable>
          ) : (
            child.props.children
          )}
        </Animated.View>
      );
    });
  };

  useEffect(() => {
    if (checkIfLayerValid(previousLayer)) {
      if (currentLayer != previousLayer) {
        animatedZIndexValues[previousLayer].value = withTiming(0, {
          duration: 400,
        });
        animatedWidthValues[previousLayer].value = withTiming(0, {
          duration: 1000,
        });
      }
    }

    if (checkIfLayerValid(currentLayer)) {
      if (currentLayer != previousLayer) {
        animatedZIndexValues[currentLayer].value = withTiming(1, {
          duration: 300,
        });
        animatedWidthValues[currentLayer].value = withTiming(100, {
          duration: 400,
        });
      }
    }

    setPreviousLayer(currentLayer);
  }, [currentLayer]);

  return (
    <Animated.View style={containerStyle}>{preprocessChildren()}</Animated.View>
  );
}

function TransitionButton({
  children,
  bgColor = "black",
  color = "#fff",
}) {
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
  TransitionButton
}