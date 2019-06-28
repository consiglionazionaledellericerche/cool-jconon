/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import it.cnr.cool.exception.CoolException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.charset.CharsetEncoder;

public class QrCodeUtil {

	public static ByteArrayOutputStream getQrcode(String md5) {
		return getQrcode(md5, BarcodeFormat.QR_CODE, 100, 100, "PNG");
	}
	
	public static ByteArrayOutputStream getQrcode(String md5, BarcodeFormat barcodeFormat, int w, int h, String imageType) {
		Charset charset = Charset.forName("ISO-8859-1");
		CharsetEncoder encoder = charset.newEncoder();
		byte[] b = null;
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		try {
			// Convert a string to ISO-8859-1 bytes in a ByteBuffer
			ByteBuffer bbuf = encoder.encode(CharBuffer.wrap(md5));
			b = bbuf.array();
			String data = new String(b, "ISO-8859-1");

			// get a byte matrix for the data
			BitMatrix matrix = null;
			com.google.zxing.Writer writer = new QRCodeWriter();
			matrix = writer.encode(data,
					com.google.zxing.BarcodeFormat.QR_CODE, w, h);
			MatrixToImageWriter.writeToStream(matrix, imageType, os);
		} catch (IOException e) {
			throw new CoolException("Error in QRCODE", e);
		} catch (WriterException e) {
			throw new CoolException("Error in QRCODE", e);
		}
		return os;
	}
}
