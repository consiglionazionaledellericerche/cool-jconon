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

import it.cnr.cool.web.scripts.exception.ClientMessageException;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;
import java.util.Optional;

public class Utility {

    public static boolean OBJEquals(Object obj1, Object obj2) {
        if (!Optional.ofNullable(obj1).isPresent() && !Optional.ofNullable(obj2).isPresent())
            return Boolean.TRUE;

        return Optional.ofNullable(obj1)
                .map(o -> o.equals(obj2))
                .orElseGet(() -> {
                    return !Optional.ofNullable(obj2).isPresent();
                });
    }

    public static BigInteger FORMATBigInteger(String bigInteger) {
        return Optional.ofNullable(bigInteger)
                .filter(s -> s.length() > 0)
                .map(s -> {
                    try {
                        return NumberFormat.getNumberInstance(Locale.ITALIAN).parse(s.replace('.', ','));
                    } catch (ParseException e) {
                        throw new ClientMessageException("Errore di formattazione per " + bigInteger);
                    }
                })
                .map(aDouble -> BigInteger.valueOf(aDouble.longValue()))
                .orElse(null);
    }

    public static BigDecimal FORMATBigDecimal(String bigDecimal) {
        return Optional.ofNullable(bigDecimal)
                .filter(s -> s.length() > 0)
                .map(s -> {
                    try {
                        return NumberFormat.getNumberInstance(Locale.ITALIAN).parse(s.replace('.', ','));
                    } catch (ParseException e) {
                        throw new ClientMessageException("Errore di formattazione per " + bigDecimal);
                    }
                })
                .map(aDouble -> BigDecimal.valueOf(aDouble.doubleValue()))
                .orElse(null);
    }
}
