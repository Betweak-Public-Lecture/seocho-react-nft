function sample(props) {
  console.log(props);
}

const sampleObj = {
  k1: "v1",
  k2: 2,
  k3: function () {
    console.log("k3");
  },
};
const sampleObj2 = {
  k3: "v3",
  k4: 4,
};

sample({ sampleObj });
sample({ ...sampleObj });
sample({ ...sampleObj, ...sampleObj2 });
