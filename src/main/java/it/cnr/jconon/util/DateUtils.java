package it.cnr.jconon.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public final class DateUtils {

	public static Calendar parse(String date) throws ParseException {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
		calendar.setTime(format.parse(date));
		return calendar;
	}
}
