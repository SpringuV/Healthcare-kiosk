package main

import (
	"encoding/base64"

	"github.com/skip2/go-qrcode" // go get github.com/skip2/go-qrcode
)

func MakeQRCode(link string) (string, error) {
	pngData, err := qrcode.Encode(link, qrcode.Medium, 256)
	if err != nil {
		return "", err
	}
	base64Str := base64.StdEncoding.EncodeToString(pngData)
	return base64Str, nil
}
