const sendSms = async (to: string, content: string) => {
  console.log("DUMMY SMS MODULE!");
  console.log({ to, content });
  return true;
};

export { sendSms };
