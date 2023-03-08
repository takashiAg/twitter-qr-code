import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import { QRCode } from "react-qrcode-logo";
import styled from "styled-components";

const ID = "react-qrcode-logo";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  flex-shrink: 0;
  flex-grow: 0;
`;

// const Button = styled.button`
//   width: 100%;
//   height: 50px;
//   box-sizing: border-box;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   flex-shrink: 0;
//   flex-grow: 0;
// `;

const Label = styled.label<{ label?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  z-index: 0;
  position: relative;
  & > * {
    z-index: 0;
  }
  &:before {
    position: absolute;
    top: 0;
    left: 10px;
    transform: translate(0, -50%);
    content: "${(props) => props.label}";
    z-index: 1;
    background: #fff;
    padding: 0 10px;
  }
`;
const Header = styled.h1``;
const Text = styled.p`
  text-align: center;
  white-space: pre-wrap;
`;

const Img = styled.img`
  width: 200px;
`;

const TWITTER_URL = "https://twitter.com/:userId";

function App() {
  const [userId, setUserId] = useState<string>("");
  const [icon, setIcon] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState<string | undefined>();
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [imageLink, setImageLink] = useState<string | undefined>();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!icon) return;
    setIconUrl(URL.createObjectURL(icon));
    (async () => {
      const i = await loadImage(icon);
      const width = i.width;
      const height = i.height;
      if (width > height) {
        setWidth(50);
        setHeight(50 * (height / width));
      } else {
        setHeight(50);
        setWidth(50 * (width / height));
      }
    })();
  }, [icon]);

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return alert("ファイルを選択してください");
    }

    setIcon(file);
  };
  // const drawIcon = async (icon: File) => {
  //   if (!icon) return;
  //   const canvas = getCanvas();
  //   if (!canvas) return;
  //   const context = canvas?.getContext("2d");
  //   if (!context) return;

  //   const img = await loadImage(icon);
  //   context.drawImage(img, 0, 0, 200, 200);
  // };

  const getCanvas = (): HTMLCanvasElement | undefined => {
    const canvas = document.getElementById(ID) as HTMLCanvasElement;
    if (!canvas) return undefined;

    return canvas;
  };

  // const getCanvasBlob = (): Promise<Blob | undefined> => {
  //   return new Promise((resolve) => {
  //     const canvas = getCanvas();
  //     if (!canvas) return resolve(undefined);
  //     canvas.toBlob((blob) => {
  //       if (!blob) return resolve(undefined);
  //       resolve(blob);
  //     });
  //   });
  // };

  // const handleDownloadImage = async (
  //   e: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   try {
  //     e.preventDefault();
  //     const canvas = getCanvas();
  //     if (!canvas) return alert("QRコードが生成されていません");
  //     const a = document.createElement("a");
  //     a.href = canvas.toDataURL("image/png");
  //     a.download = `twitterqr${userId}.png`;
  //     a.click();
  //   } catch (e) {
  //     alert((e as any)?.message);
  //   }
  // };

  const genImageLink = useCallback(async () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const ref = canvas.toDataURL("image/png");
    setImageLink(ref);
  }, []);
  useEffect(() => {
    genImageLink();
  }, [count, genImageLink]);

  useEffect(() => {
    setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, [setCount]);

  // useEffect(() => {
  //   if (!icon) return;
  //   drawIcon(icon);
  // }, [icon, userId]);

  return (
    <Container>
      <Header>Twitter QRコードジェネレーター</Header>
      <Text>
        {
          "twitterのQR機能が廃止されたので作りました🥺\ntwitterのIDを入力するとQRコードを表示します\n\nアイコン画像を真ん中に表示できます！"
        }
      </Text>
      <Label label={"twitterのID"}>
        <Input value={userId} onChange={(e) => setUserId(e.target.value)} />
      </Label>
      <Label label={"アイコン"}>
        <Input
          onChange={handleFileChange}
          type="file"
          accept="image/png, image/jpeg"
        />
      </Label>

      {userId && (
        <span style={{ display: "none" }}>
          <QRCode
            value={TWITTER_URL.replace(":userId", userId)}
            logoImage={iconUrl}
            logoWidth={width}
            logoHeight={height}
            size={200}
            ecLevel="H"
            id={ID}
          />
        </span>
      )}
      <Img src={imageLink} alt="" />
    </Container>
  );
}

export default App;
