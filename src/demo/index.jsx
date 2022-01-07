import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  TransitionComponent as TransitionContainer,
  TransitionLayer,
  TransitionButton,
} from "../components/TransitionComponent";

export default function Demo() {
  return (
    <View style={styles.container}>
      <TransitionContainer layers={3} containerStyle={{ height: "90%" }}>
        <TransitionLayer
          layerNumber={0}
          transitionType="fade"
          containerStyle={{
            height: "30%",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 32, fontWeight: "bold" }}>
            Heading: MY APP
          </Text>
          <View style={{ height: 20 }}></View>

          <Text style={{ fontSize: 18 }}>Subtitle, Some Stuff.</Text>
        </TransitionLayer>

        <TransitionLayer
          layerNumber={1}
          transitionType="fade"
          containerWidth="80%"
          containerStyle={{
            justifyContent: "center",
            padding: 10,
            marginTop: 40,
          }}
        >
          <Text style={{ fontSize: 32, fontWeight: "bold" }}>
            Let's sign you up
          </Text>
        </TransitionLayer>

        <TransitionLayer
          layerNumber={1}
          transitionType="fade"
          containerStyle={{
            marginTop: 120,
            height: "30%",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <View style={{ justifyContent: "center", flexDirection: "row" }}>
            <Text style={{ fontSize: 32, fontWeight: "bold" }}>Welcome!</Text>
          </View>
        </TransitionLayer>

        <TransitionLayer
          layerNumber={2}
          switchLayerOnPress={0}
          transitionType="fade"
          containerWidth="20%"
          containerStyle={{
            marginTop: 40,
            padding: 10,
            height: "8%",
            justifyContent: "center",
          }}
        >
          <TransitionButton bgColor="transparent" color="black" />
        </TransitionLayer>

        <TransitionLayer
          layerNumber={2}
          transitionType="fade"
          containerWidth="80%"
          containerStyle={{
            marginTop: 40,
            padding: 10,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 32, fontWeight: "bold" }}>Login</Text>
        </TransitionLayer>

        <TransitionLayer
          layerNumber={2}
          transitionType="fade"
          containerStyle={{
            marginTop: 50,
            height: "40%",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <View style={{ justifyContent: "center", flexDirection: "row" }}>
            <Text style={{ fontSize: 32, fontWeight: "bold" }}>
              Welcome back
            </Text>
          </View>
        </TransitionLayer>

        <TransitionLayer
          layerNumber={0}
          switchLayerOnPress={1}
          containerWidth={"50%"}
          containerStyle={{
            bottom: 0,
          }}
        >
          <TransitionButton>{"Register"}</TransitionButton>
        </TransitionLayer>
        <TransitionLayer
          layerNumber={0}
          switchLayerOnPress={2}
          containerStyle={{ right: 0, bottom: 0 }}
          containerWidth={"50%"}
        >
          <TransitionButton bgColor="white" color="black">
            {"Login"}
          </TransitionButton>
        </TransitionLayer>
        <TransitionLayer
          layerNumber={1}
          switchLayerOnPress={0}
          containerStyle={{ bottom: 0 }}
          onPress={() => console.log("Pressed Submit")}
        >
          <TransitionButton>{"Submit"}</TransitionButton>
        </TransitionLayer>
        <TransitionLayer
          layerNumber={2}
          onPress={() => console.log("Pressed Login")}
          containerStyle={{ right: 0, bottom: 0 }}
        >
          <TransitionButton>{"Login"}</TransitionButton>
        </TransitionLayer>
      </TransitionContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10,
    paddingTop: 20,
  },
});
