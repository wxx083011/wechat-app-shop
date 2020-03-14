const fsm = wx.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名

function base64src(base64data, cb) {
  const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}`;
  const buffer = wx.base64ToArrayBuffer(base64data);
  fsm.writeFile({
    filePath: filePath,
    data: buffer,
    encoding: 'base64',
    success: res => {
      cb(filePath);
    },
    fail: res => {
      return (new Error('ERROR_BASE64SRC_WRITE'));
    }
  });
};

export { base64src };