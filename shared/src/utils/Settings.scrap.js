<View
  style={{
    padding: 10,
  }}
>
  <Formik
    initialValues={{
      email: User.email,
    }}
    validationSchema={EmailSchema}
    onSubmit={(values) => {
      console.log(values);
    }}
  >
    {(props) => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",

          borderWidth: 1,
          borderColor: Colors.gray,
          borderRadius: 10,
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name={iconList[3]} size={24} color={Colors.lavenderBlue} />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              marginLeft: 15,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "200",
                fontSize: 20,
                marginBottom: 5,
                textAlign: "left",
              }}
            >
              Email
            </Text>
            <Text style={{ color: "#fff", textAlign: "left" }}>
              {props.values.email}
            </Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => console.log("Edit Email")}>
          <Feather
            name={iconList[iconList.length - 2]}
            size={24}
            color={Colors.lavenderWeb}
          />
        </TouchableWithoutFeedback>
      </View>
    )}
  </Formik>
</View>;

<View
  style={{
    padding: 10,
  }}
>
  <Formik
    initialValues={{
      phoneNumber: User.phoneNumber || "",
    }}
    validationSchema={PhoneNumberSchema}
    onSubmit={(values) => {
      console.log(values);
    }}
  >
    {(props) => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",

          borderWidth: 1,
          borderColor: Colors.gray,
          borderRadius: 10,
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name={iconList[2]} size={24} color={Colors.lavenderBlue} />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              marginLeft: 15,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "200",
                fontSize: 20,
                marginBottom: 5,
                textAlign: "left",
              }}
            >
              Phone Number
            </Text>
            <Text style={{ color: "#fff", textAlign: "left" }}>
              {props.values.phoneNumber === ""
                ? "Add Phone Number"
                : props.values.phoneNumber}
            </Text>
          </View>
        </View>
        <TouchableWithoutFeedback
          onPress={() => console.log("Edit Phone Number")}
        >
          <Feather
            name={iconList[iconList.length - 2]}
            size={24}
            color={Colors.lavenderWeb}
          />
        </TouchableWithoutFeedback>
      </View>
    )}
  </Formik>
</View>;
