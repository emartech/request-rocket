import sinon from 'sinon';
import { promises as fs } from 'fs';
import electron from 'electron';
import FileLoader from '../../../../../src/main/file-handler/file-loader';
import FileOperationStatus from '../../../../../src/main/file-handler/file-operation-status';

const SELECTED_FILE_PATH = 'file';
const PAYLOAD = 'payload';
let sandbox;

describe('load', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    delete electron.dialog;
  });

  afterEach(() => {
    sandbox.restore();
  });

  function stubShowOpenDialog(result) {
    const showOpenDialogStub = sandbox.stub();
    showOpenDialogStub.resolves(result);
    electron.dialog = { showOpenDialog: showOpenDialogStub };
    return showOpenDialogStub;
  }

  it('returns cancelled result when open dialog is cancelled', async () => {
    const showOpenDialogStub = stubShowOpenDialog({ canceled: true });
    const readFileStub = sandbox.stub(fs, 'readFile');

    const result = await FileLoader.load();

    assert(readFileStub.notCalled);
    assert(showOpenDialogStub.called);
    expect(result.status).to.eql(FileOperationStatus.CANCELLED);
    expect(result.rawFileContent).to.eql(null);
  });

  it('returns raw file content when open dialog succeeded', async () => {
    const showOpenDialogStub = stubShowOpenDialog({ filePaths: [SELECTED_FILE_PATH] });
    const readFileStub = sandbox.stub(fs, 'readFile').resolves(PAYLOAD);

    const result = await FileLoader.load();

    assert(showOpenDialogStub.called);
    assert(readFileStub.calledWith(SELECTED_FILE_PATH, 'utf8'));
    expect(result.status).to.eql(FileOperationStatus.SUCCESSFUL);
    expect(result.rawFileContent).to.eql(PAYLOAD);
  });
});
