import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function TransitionElement({
  transitionIndex,
  transitionOnPress,
  transitionType,
  children,
  containerWidth,
  containerStyle,
  onPress,
}) {
  return <View style={[containerStyle]}>{children}</View>;
}

export default function index({ children, transitions, containerStyle = {} }) {
  const [currTransition, setCurrTransition] = useState(0);
  const animatedWidthValues = Array(transitions)
    .fill(0)
    .map((x) => useSharedValue(0));

  const animatedZIndexValues = Array(transitions)
    .fill(0)
    .map((x) => useSharedValue(0));

  const preprocessChildren = () => {
    return React.Children.map(children, (child, _) => {
      const transitionIndex = parseInt(child.props?.transitionIndex || 0);
      const transitionType = child.props.transitionType || "slide";
      const transitionOnPress = parseInt(child.props?.transitionOnPress || 0);
      const onPress = child.props?.onPress;
      const containerWidthWithUnit = (
        child.props?.containerWidth || "100%"
      ).toString();

      let unit = "%";
      let containerWidthValue = 100;

      if (containerWidthWithUnit.endsWith("%")) {
        containerWidthValue = parseFloat(
          containerWidthWithUnit.slice(0, containerWidthWithUnit.length - 1)
        );
      } else if (containerWidthWithUnit.endsWith("px")) {
        containerWidthValue = parseFloat(
          containerWidthWithUnit.slice(0, containerWidthWithUnit.length - 2)
        );
      }

      let onPressHandler = null;
      if (onPress != null || transitionOnPress >= 0) {
        onPressHandler = () => {
          if (
            transitionOnPress >= 0 &&
            transitionOnPress <= transitions &&
            transitionOnPress != transitionIndex
          ) {
            setCurrTransition(transitionOnPress);
          }

          if (onPress) {
            onPress();
          }
        }
      }
      
      let animatedStyle = {};

      if (transitionType == "slide") {
        animatedStyle = useAnimatedStyle(() => {
          const animatedWidthValue = interpolate(
            animatedWidthValues[transitionIndex].value,
            [0, 100],
            [0, containerWidthValue]
          );

          return {
            width: animatedWidthValue + unit,
            zIndex: animatedZIndexValues[transitionIndex].value,
            opacity: animatedZIndexValues[transitionIndex].value * 100,
          };
        });
      } else {
        animatedStyle = useAnimatedStyle(() => {
          return {
            width: containerWidthValue + unit,
            zIndex: animatedZIndexValues[transitionIndex].value,
            opacity: animatedZIndexValues[transitionIndex].value,
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
            <Pressable onPress={onPressHandler}>{child.props.children}</Pressable>
          ) : (
            child.props.children
          )}
        </Animated.View>
      );
    });
  };

  useEffect(() => {
    animatedWidthValues.forEach((x, i) => {
      if (i == currTransition) {
        animatedZIndexValues[i].value = withTiming(1, {
          duration: 300,
        });
        x.value = withTiming(100, {
          duration: 400,
        });
      } else {
        animatedZIndexValues[i].value = withTiming(0, {
          duration: 400,
        });
        x.value = withTiming(0, {
          duration: 1000,
        });
      }
    });
  }, [currTransition]);

  return (
    <Animated.View style={containerStyle}>{preprocessChildren()}</Animated.View>
  );
}
